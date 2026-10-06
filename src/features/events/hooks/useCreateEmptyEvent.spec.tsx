import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { ReactNode } from 'react';

import useCreateEmptyEvent from './useCreateEmptyEvent';
import useCreateEvent from './useCreateEvent';
import { act, renderHook } from 'utils/testing';
import mockEvent from 'utils/testing/mocks/mockEvent';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

jest.mock('./useCreateEvent');

const createEvent = jest.fn<ReturnType<typeof useCreateEvent>>();
const showSnackbar = jest.fn();
const dates = {
  campaign_id: 559,
  end_time: '2026-09-16T10:00:00',
  start_time: '2026-09-16T09:00:00',
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <ZUISnackbarContext.Provider
      value={{ hideSnackbar: jest.fn(), isOpen: false, showSnackbar }}
    >
      {children}
    </ZUISnackbarContext.Provider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  createEvent.mockReset();
  jest.mocked(useCreateEvent).mockReturnValue(createEvent);
});

describe('useCreateEmptyEvent', () => {
  it('blocks concurrent calls before rerendering and returns the created event', async () => {
    const event = mockEvent();
    let resolveRequest!: (value: typeof event) => void;
    createEvent.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );
    const { result } = renderHook(() => useCreateEmptyEvent(14), { wrapper });
    let request!: ReturnType<typeof result.current.createEmptyEvent>;

    await act(async () => {
      request = result.current.createEmptyEvent(dates);
      expect(await result.current.createEmptyEvent(dates)).toBeNull();
    });
    expect(createEvent).toHaveBeenCalledTimes(1);
    expect(result.current.creating).toBe(true);

    await act(async () => {
      resolveRequest(event);
      expect(await request).toBe(event);
    });
    expect(result.current.creating).toBe(false);
    expect(showSnackbar).not.toHaveBeenCalled();
  });

  it('returns null on failure and releases the lock for a retry', async () => {
    const event = mockEvent();
    createEvent
      .mockRejectedValueOnce(new Error('Request failed'))
      .mockResolvedValueOnce(event);
    const { result } = renderHook(() => useCreateEmptyEvent(14), { wrapper });

    await act(async () => {
      expect(await result.current.createEmptyEvent(dates)).toBeNull();
    });
    expect(result.current.creating).toBe(false);
    expect(showSnackbar).toHaveBeenCalledWith('error');

    await act(async () => {
      expect(await result.current.createEmptyEvent(dates)).toBe(event);
    });
    expect(createEvent).toHaveBeenCalledTimes(2);
    expect(result.current.creating).toBe(false);
  });
});
