import RelativeTime from '.';
import { render } from 'utils/testing';

describe('<RelativeTime />', () => {
  it('does not display time in the future if forcePast is set.', () => {
    const mockDatetime = new Date();
    mockDatetime.setDate(new Date().getDate() + 1);

    const { getByText } = render(
      <RelativeTime datetime={mockDatetime.toISOString()} forcePast />
    );

    expect(getByText('now')).toBeTruthy();
  });
});
