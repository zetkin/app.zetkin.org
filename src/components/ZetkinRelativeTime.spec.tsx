import { render } from 'utils/testing';
import ZetkinRelativeTime from './ZetkinRelativeTime';

describe('<ZetkinRelativeTime />', () => {
  it('does not display time in the future if forcePast is set.', () => {
    const mockDatetime = new Date();
    mockDatetime.setDate(new Date().getDate() + 1);

    const { getByText } = render(
      <ZetkinRelativeTime datetime={mockDatetime.toISOString()} forcePast />
    );

    expect(getByText('now')).toBeTruthy();
  });
});
