import dayjs from 'dayjs';

import mockUpdate from 'utils/testing/mocks/mockUpdate';
import { render } from 'utils/testing';
import Timeline, { SHOW_INITIALLY, TimelineProps } from '.';

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

describe('EditTextInPlace', () => {
  it('displays the correct number of updates', () => {
    const { getAllByLabelText } = render(<Timeline {...props} />);
    const updates = getAllByLabelText('timeline update');
    expect(updates.length).toEqual(SHOW_INITIALLY);
  });
});
