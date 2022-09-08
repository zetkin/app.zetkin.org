import 'next-router-mock/dynamic-routes';
import dayjs from 'dayjs';
import mockRouter from 'next-router-mock';

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import { UPDATE_TYPES } from 'types/updates';
import { fireEvent, render } from 'utils/testing';
import Timeline, { SHOW_INITIALLY, TimelineProps } from '.';

import { createDynamicRouteParser } from 'next-router-mock/dynamic-routes';

mockRouter.useParser(
  createDynamicRouteParser(['/organize/[orgId]/people/[id]'])
);
jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('isomorphic-dompurify', () => ({
  sanitize: (dirtyHtml: string) => dirtyHtml,
}));

const NUM_UPDATES = 10;

const props: TimelineProps = {
  onAddNote: () => null,
  updates: Array.from(Array(NUM_UPDATES).keys()).map(() =>
    mockUpdate(UPDATE_TYPES.JOURNEYINSTANCE_ADDASSIGNEE, {
      timestamp: dayjs()
        .subtract(Math.random() * 100, 'hours')
        .format(),
    })
  ),
};

describe('Timeline', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/initial');
  });

  it('displays all updates', () => {
    const { getAllByLabelText } = render(<Timeline {...props} />);
    const updates = getAllByLabelText('timeline update');
    expect(
      updates.filter(
        (update) => getComputedStyle(update).visibility === 'visible'
      ).length
    ).toEqual(NUM_UPDATES);
  });

  it('if expandable, expands to show all updates', () => {
    const { getAllByLabelText, getByText } = render(
      <Timeline {...props} expandable={true} />
    );
    const updatesBefore = getAllByLabelText('timeline update');
    expect(
      updatesBefore.filter(
        (update) => getComputedStyle(update).visibility === 'visible'
      ).length
    ).toEqual(SHOW_INITIALLY);
    const showMore = getByText('misc.timeline.expand');
    fireEvent.click(showMore);
    const updates = getAllByLabelText('timeline update');
    expect(
      updates.filter(
        (update) => getComputedStyle(update).visibility === 'visible'
      ).length
    ).toEqual(NUM_UPDATES);
  });
});
