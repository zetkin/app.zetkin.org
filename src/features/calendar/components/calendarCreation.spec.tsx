import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ComponentProps, StrictMode } from 'react';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';

import CalendarMonthView from './CalendarMonthView';
import CalendarWeekView from './CalendarWeekView';
import EventDayLane from './CalendarWeekView/EventDayLane';
import EventShiftDetails from './EventShiftModal/EventShiftDetails';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from 'utils/testing';
import useCreateEvent from 'features/events/hooks/useCreateEvent';
import useMonthCalendarEvents from '../hooks/useMonthCalendarEvents';
import useNumericRouteParams from 'core/hooks/useNumericRouteParams';
import useWeekCalendarEvents from '../hooks/useWeekCalendarEvents';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import mockEvent from 'utils/testing/mocks/mockEvent';
import { CLUSTER_TYPE } from 'features/projects/hooks/useClusteredActivities';

jest.mock('features/events/hooks/useCreateEvent');
jest.mock('../hooks/useMonthCalendarEvents');
jest.mock('../hooks/useWeekCalendarEvents');
jest.mock('core/hooks/useNumericRouteParams');
jest.mock('zui/hooks/useResizeObserver', () => () => ({ current: null }));
jest.mock(
  './EventCluster',
  () =>
    function TestEventCluster() {
      return <button>Existing event</button>;
    }
);
jest.mock('./CalendarWeekView/EventDayLane', () => {
  const ActualLane = jest.requireActual<{ default: typeof EventDayLane }>(
    './CalendarWeekView/EventDayLane'
  ).default;
  return function TestLane(props: ComponentProps<typeof EventDayLane>) {
    return (
      <div data-testid="day-lane">
        <ActualLane {...props} />
      </div>
    );
  };
});
// Keep the real shifts dialog and time editor; isolate unrelated API-backed
// type and location pickers while exposing the dialog's date/title state.
jest.mock('./EventShiftModal/EventShiftDetails', () => {
  return function TestDetails({
    eventDate,
    eventTitle,
    onEventTitleChange,
  }: ComponentProps<typeof EventShiftDetails>) {
    return (
      <>
        <output aria-label="Event date">
          {eventDate.format('YYYY-MM-DD')}
        </output>
        <input
          aria-label="Event title"
          onChange={(ev) => onEventTitleChange(ev.target.value)}
          value={eventTitle}
        />
      </>
    );
  };
});

const createEvent = jest.fn<ReturnType<typeof useCreateEvent>>();
const showSnackbar = jest.fn();
const onClickDay = jest.fn();
const onClickWeek = jest.fn();
let user: ReturnType<typeof userEvent.setup>;

function monthView(date = '2026-09-16') {
  return (
    <IntlProvider
      locale="en"
      messages={{ 'feat.calendar.createOnDate': 'Create event on {date}' }}
    >
      <ZUISnackbarContext.Provider
        value={{ hideSnackbar: jest.fn(), isOpen: false, showSnackbar }}
      >
        <CalendarMonthView
          focusDate={Temporal.PlainDate.from(date)}
          onClickDay={onClickDay}
          onClickWeek={onClickWeek}
        />
      </ZUISnackbarContext.Provider>
    </IntlProvider>
  );
}

function createButton(date: string) {
  const label = Temporal.PlainDate.from(date).toLocaleString('en', {
    dateStyle: 'long',
  });
  return screen.getByRole('button', { name: `Create event on ${label}` });
}

async function openShifts(date: string) {
  await user.click(createButton(date));
  await user.click(
    screen.getByRole('menuitem', {
      name: 'feat.calendar.createMenu.shiftEvent',
    })
  );
}

beforeEach(() => {
  jest.useFakeTimers();
  user = userEvent.setup({
    advanceTimers: async (delay) => {
      await act(async () => {
        await jest.advanceTimersByTimeAsync(delay);
      });
    },
  });
  jest.clearAllMocks();
  createEvent.mockReset().mockResolvedValue(mockEvent());
  jest.mocked(useCreateEvent).mockReturnValue(createEvent);
  jest
    .mocked(useNumericRouteParams)
    .mockReturnValue({ orgId: 14, projectId: 559 });
  jest
    .mocked(useMonthCalendarEvents)
    .mockReturnValue(
      Array.from({ length: 42 }, () => ({ clusters: [], date: new Date() }))
    );
  jest.mocked(useWeekCalendarEvents).mockReturnValue(
    Array.from({ length: 7 }, () => ({
      date: new Date(),
      lanes: [],
      multidayEvents: [],
    }))
  );
  // JSDOM has no layout. Give MUI a visible anchor and the drag lane 100px/hour.
  jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    bottom: 2400,
    height: 2400,
    left: 0,
    right: 120,
    toJSON: () => ({}),
    top: 0,
    width: 120,
    x: 0,
    y: 0,
  });
});

afterEach(async () => {
  await act(async () => {
    cleanup();
    await jest.runOnlyPendingTimersAsync();
  });
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Month calendar creation', () => {
  it('keeps background, date, week and event clicks separate from creation', async () => {
    jest.mocked(useMonthCalendarEvents).mockReturnValue(
      Array.from({ length: 42 }, (_, index) => ({
        clusters:
          index === 0
            ? [{ events: [mockEvent()], kind: CLUSTER_TYPE.SINGLE }]
            : [],
        date: new Date(),
      }))
    );
    render(monthView());
    const button = createButton('2026-09-16');
    const header = button.parentElement!;
    await user.click(header.parentElement!);
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(within(header).getByText('16'));
    expect(onClickDay).toHaveBeenCalledTimes(1);
    expect(onClickDay.mock.calls[0][0]).toEqual(new Date(2026, 8, 16));
    await user.click(screen.getByText('38'));
    expect(onClickWeek).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'Existing event' }));
    expect(screen.queryByRole('menu')).toBeNull();
    await user.click(button);
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(onClickDay).toHaveBeenCalledTimes(1);
    expect(createEvent).not.toHaveBeenCalled();
  });

  it.each([
    '2026-08-31',
    '2026-09-16',
    '2026-10-01',
    '2026-03-29',
    '2026-10-25',
  ])('creates a single event at 09:00–10:00 on %s', async (date) => {
    render(
      monthView(
        date === '2026-08-31' || date === '2026-10-01' ? '2026-09-16' : date
      )
    );
    await user.click(createButton(date));
    await user.click(
      screen.getByRole('menuitem', {
        name: 'feat.calendar.createMenu.singleEvent',
      })
    );
    expect(createEvent).toHaveBeenCalledWith({
      activity_id: null,
      campaign_id: 559,
      end_time: `${date}T10:00:00`,
      location_id: null,
      start_time: `${date}T09:00:00`,
      title: null,
    });
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('supports keyboard opening, Escape, outside dismissal and focus restoration', async () => {
    render(monthView());
    const button = createButton('2026-09-16');
    await act(async () => button.focus());
    await user.keyboard('{Enter}');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(button);
    await user.click(button);
    await act(async () => {
      fireEvent.click(document.querySelector('.MuiBackdrop-root')!);
    });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('blocks duplicate submissions and allows retry after failure', async () => {
    let rejectRequest!: (reason: Error) => void;
    createEvent.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        })
    );
    render(monthView());
    await user.click(createButton('2026-09-16'));
    await user.dblClick(
      screen.getByRole('menuitem', {
        name: 'feat.calendar.createMenu.singleEvent',
      })
    );
    expect(createEvent).toHaveBeenCalledTimes(1);
    expect(
      screen
        .getByRole('menuitem', { name: 'feat.calendar.createMenu.singleEvent' })
        .getAttribute('aria-disabled')
    ).toBe('true');
    await act(async () => rejectRequest(new Error('Request failed')));
    expect(showSnackbar).toHaveBeenCalledWith('error');
    await user.click(
      screen.getByRole('menuitem', {
        name: 'feat.calendar.createMenu.singleEvent',
      })
    );
    expect(createEvent).toHaveBeenCalledTimes(2);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it.each(['2026-03-29', '2026-10-25', '2026-12-31'])(
    'initializes and saves shifts without changing the wall-clock date/time on %s',
    async (date) => {
      render(monthView(date));
      await openShifts(date);
      expect(screen.getByLabelText('Event date').textContent).toBe(date);
      expect(
        (
          screen.getByLabelText(
            'feat.events.eventShiftModal.start'
          ) as HTMLInputElement
        ).value
      ).toContain('09:00');
      expect(
        (
          screen.getByLabelText(
            'feat.events.eventShiftModal.end'
          ) as HTMLInputElement
        ).value
      ).toContain('10:00');
      await user.click(
        screen.getByRole('button', {
          name: /feat.events.eventShiftModal.draft/i,
        })
      );
      expect(createEvent).toHaveBeenCalledTimes(2);
      expect(createEvent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          campaign_id: 559,
          end_time: `${date}T09:30:00.000Z`,
          published: null,
          start_time: `${date}T09:00:00.000Z`,
        }),
        false
      );
      expect(createEvent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          end_time: `${date}T10:00:00.000Z`,
          start_time: `${date}T09:30:00.000Z`,
        }),
        false
      );
    }
  );

  it('blocks duplicate shift submissions and restores the form after failure', async () => {
    let rejectRequest!: (reason: Error) => void;
    const request = new Promise<ReturnType<typeof mockEvent>>((_, reject) => {
      rejectRequest = reject;
    });
    createEvent.mockReturnValueOnce(request).mockReturnValueOnce(request);
    render(monthView());
    await openShifts('2026-09-16');
    const saveButton = screen.getByRole('button', {
      name: /feat.events.eventShiftModal.draft/i,
    });
    await user.dblClick(saveButton);
    expect(createEvent).toHaveBeenCalledTimes(2);
    expect((saveButton as HTMLButtonElement).disabled).toBe(true);
    await act(async () => rejectRequest(new Error('Request failed')));
    expect(showSnackbar).toHaveBeenCalledWith(
      'error',
      'feat.events.eventShiftModal.error'
    );
    await user.click(saveButton);
    expect(createEvent).toHaveBeenCalledTimes(4);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it.each([
    { date: '2026-09-17', outcome: 'success' },
    { date: '2026-09-16', outcome: 'success' },
    { date: '2026-10-16', outcome: 'success' },
    { date: '2026-09-17', outcome: 'error' },
  ])(
    'preserves the new form on $date when a dismissed save reports $outcome',
    async ({ date, outcome }) => {
      let resolveRequest!: (event: ReturnType<typeof mockEvent>) => void;
      let rejectRequest!: (reason: Error) => void;
      const request = new Promise<ReturnType<typeof mockEvent>>(
        (resolve, reject) => {
          resolveRequest = resolve;
          rejectRequest = reject;
        }
      );
      createEvent.mockReturnValueOnce(request).mockReturnValueOnce(request);
      const { rerender } = render(monthView());
      await openShifts('2026-09-16');
      await user.click(
        screen.getByRole('button', {
          name: /feat.events.eventShiftModal.draft/i,
        })
      );
      expect(createEvent).toHaveBeenCalledTimes(2);
      await user.click(screen.getByTestId('CloseIcon'));
      await act(async () => rerender(monthView(date)));
      await openShifts(date);
      const dialog = screen.getByRole('dialog');
      const titleInput = screen.getByLabelText('Event title');
      await user.type(titleInput, 'New unsaved form');
      expect(document.activeElement).toBe(titleInput);

      await act(async () => {
        if (outcome === 'success') {
          resolveRequest(mockEvent());
        } else {
          rejectRequest(new Error('Request failed'));
        }
      });

      expect(screen.queryByRole('dialog')).toBe(dialog);
      expect(screen.getByLabelText('Event date').textContent).toBe(date);
      expect((titleInput as HTMLInputElement).value).toBe('New unsaved form');
      expect(document.activeElement).toBe(titleInput);
      expect(createEvent).toHaveBeenCalledTimes(2);
      expect(showSnackbar).toHaveBeenCalledTimes(1);
      expect(showSnackbar).toHaveBeenCalledWith(
        outcome,
        outcome === 'success'
          ? expect.anything()
          : 'feat.events.eventShiftModal.error'
      );
    }
  );

  it.each(['draft', 'publish'])(
    'closes the active shift form and restores focus after %s in Strict Mode',
    async (action) => {
      render(<StrictMode>{monthView()}</StrictMode>);
      await openShifts('2026-09-16');
      await user.click(
        screen.getByRole('button', {
          name: new RegExp(`feat.events.eventShiftModal.${action}`, 'i'),
        })
      );
      expect(createEvent).toHaveBeenCalledTimes(2);
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(createButton('2026-09-16'));
      expect(showSnackbar).toHaveBeenCalledWith('success', expect.anything());
    }
  );

  it('initializes a fresh shift form after closing and selecting another day', async () => {
    render(monthView());
    await openShifts('2026-09-16');
    await user.type(screen.getByLabelText('Event title'), 'Discard me');
    await user.click(screen.getByTestId('CloseIcon'));
    expect(document.activeElement).toBe(createButton('2026-09-16'));
    await openShifts('2026-09-17');
    expect(screen.getByLabelText('Event date').textContent).toBe('2026-09-17');
    expect(
      (screen.getByLabelText('Event title') as HTMLInputElement).value
    ).toBe('');
    expect(createEvent).not.toHaveBeenCalled();
  });

  it('clears the dropdown and shift dialog when navigating to another month', async () => {
    const { rerender } = render(monthView());
    await user.click(createButton('2026-09-16'));
    await act(async () => rerender(monthView('2026-10-16')));
    expect(screen.queryByRole('menu')).toBeNull();
    await openShifts('2026-10-16');
    await act(async () => rerender(monthView('2026-11-16')));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(createEvent).not.toHaveBeenCalled();
  });
});

describe('Week calendar shared creation menu', () => {
  function dragWeek() {
    render(
      <ZUISnackbarContext.Provider
        value={{ hideSnackbar: jest.fn(), isOpen: false, showSnackbar }}
      >
        <CalendarWeekView
          focusDate={Temporal.PlainDate.from('2026-09-16')}
          onClickDay={onClickDay}
        />
      </ZUISnackbarContext.Provider>
    );
    const lane = screen.getAllByTestId('day-lane')[0].firstElementChild!;
    fireEvent.mouseDown(lane, { clientY: 900 });
    fireEvent.mouseMove(document, { clientY: 1100 });
    fireEvent.mouseUp(document);
  }

  it('still creates a single event using the dragged time range', async () => {
    dragWeek();
    await user.click(
      screen.getByRole('menuitem', {
        name: 'feat.calendar.createMenu.singleEvent',
      })
    );
    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        campaign_id: 559,
        end_time: '2026-09-14T11:00:00',
        start_time: '2026-09-14T09:00:00',
      })
    );
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  });

  it('prevents duplicate submissions and retries the dragged range after failure', async () => {
    let rejectRequest!: (reason: Error) => void;
    createEvent.mockImplementationOnce(
      () =>
        new Promise((_, reject) => {
          rejectRequest = reject;
        })
    );
    dragWeek();
    const singleItem = screen.getByRole('menuitem', {
      name: 'feat.calendar.createMenu.singleEvent',
    });
    await user.dblClick(singleItem);
    expect(createEvent).toHaveBeenCalledTimes(1);
    expect(singleItem.getAttribute('aria-disabled')).toBe('true');
    expect(
      screen
        .getByRole('menuitem', { name: 'feat.calendar.createMenu.shiftEvent' })
        .getAttribute('aria-disabled')
    ).toBe('true');

    await act(async () => rejectRequest(new Error('Request failed')));
    expect(showSnackbar).toHaveBeenCalledWith('error');
    expect(singleItem.getAttribute('aria-disabled')).not.toBe('true');
    await user.click(singleItem);
    expect(createEvent).toHaveBeenCalledTimes(2);
    expect(createEvent.mock.calls[1]).toEqual(createEvent.mock.calls[0]);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('still opens the shifts dialog after dragging', async () => {
    dragWeek();
    await user.click(
      screen.getByRole('menuitem', {
        name: 'feat.calendar.createMenu.shiftEvent',
      })
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(createEvent).not.toHaveBeenCalled();
  });
});
