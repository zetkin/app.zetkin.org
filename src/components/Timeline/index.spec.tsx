import 'next-router-mock/dynamic-routes';
import dayjs from 'dayjs';
import mockRouter from 'next-router-mock';

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import { fireEvent, render } from 'utils/testing';
import Timeline, { SHOW_INITIALLY, TimelineProps } from '.';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
mockRouter.registerPaths(['/organize/[orgId]/people/[id]']);
jest.mock('next/dist/client/router', () => require('next-router-mock'));

const NUM_UPDATES = 10;

const props: TimelineProps = {
  updates: Array.from(Array(NUM_UPDATES).keys()).map(() =>
    mockUpdate({
      created_at: dayjs()
        .subtract(Math.random() * 100, 'hours')
        .format(),
    })
  ),
};

describe('Timeline', () => {
  beforeEach(() => {
    mockRouter.setCurrentUrl('/initial');
  });

  it('displays the correct number of updates initially', () => {
    const { getAllByLabelText } = render(<Timeline {...props} />);
    const updates = getAllByLabelText('timeline update');
    expect(updates.length).toEqual(SHOW_INITIALLY);
  });

  it('expands to show all updates', () => {
    const { getAllByLabelText, getByText } = render(<Timeline {...props} />);
    const showMore = getByText('misc.timeline.expand');
    fireEvent.click(showMore);
    const updates = getAllByLabelText('timeline update');
    expect(updates.length).toEqual(NUM_UPDATES);
  });
});
