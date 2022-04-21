import mockUpdate from 'utils/testing/mocks/mockUpdate';
import { render } from 'utils/testing';
import Timeline, { SHOW_INITIALLY, TimelineProps } from '.';
import dayjs from 'dayjs';

const NUM_UPDATES = 10;

const hoursAgo: number[] = Array.from({ length: NUM_UPDATES })
  .reduce(
    (acc: number[], val, i: number) =>
      acc.concat(i > 1 ? acc[i - 1] + acc[i - 2] : i),
    []
  )
  .slice(2);

const props: TimelineProps = {
  updates: hoursAgo.map((hours) =>
    mockUpdate({ created_at: dayjs().subtract(hours, 'hours').format() })
  ),
};

describe('EditTextInPlace', () => {
  it('displays the correct number of updates', () => {
    const { getAllByLabelText } = render(<Timeline {...props} />);
    const updates = getAllByLabelText('timeline update');
    expect(updates.length).toEqual(SHOW_INITIALLY);
  });
});
