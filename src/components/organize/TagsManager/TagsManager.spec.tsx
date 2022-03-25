import { click } from '@testing-library/user-event/dist/click';
import { render } from 'utils/testing';

import mockTag from 'utils/testing/mocks/mockTag';
import TagsManager from '.';

describe('<TagsManager />', () => {
  describe('Renders list of tags passed in', () => {
    it('informs user if no tags applied', () => {
      const { getByText } = render(<TagsManager appliedTags={[]} />);
      expect(getByText('misc.tags.tagsManager.noTags')).toBeTruthy();
    });
    it('shows tags that have been applied in the tags list', () => {
      const tag1 = mockTag({ title: 'Organiser' });
      const tag2 = mockTag({ id: 2, title: 'Activist' });
      const { getByText } = render(<TagsManager appliedTags={[tag1, tag2]} />);
      expect(getByText('Organiser')).toBeTruthy();
      expect(getByText('Activist')).toBeTruthy();
    });
  });
  it('groups tags when clicking toggle', () => {
    const tags = [
      mockTag({ group: { id: 1, title: 'Political' } }),
      mockTag({
        group: { id: 1, title: 'Political' },
        id: 2,
        title: 'Activist',
      }),
      mockTag({
        group: { id: 2, title: 'Skills' },
        id: 3,
        title: 'Software',
      }),
      mockTag({
        group: { id: 2, title: 'Skills' },
        id: 4,
        title: 'Cooking',
      }),
      // Ungrouped tags
      mockTag({
        group: null,
        id: 5,
        title: 'Vegan',
      }),
      mockTag({
        group: null,
        id: 5,
        title: 'Listens to progg',
      }),
    ];
    const { getByTestId, getByText } = render(
      <TagsManager appliedTags={tags} />
    );
    const toggle = getByTestId('TagsManager-groupToggle').firstChild
      ?.firstChild as Element & { disabled: boolean };
    expect(toggle.disabled).toBeFalsy();
    click(toggle);
    // Shows group titles
    expect(getByText('Political')).toBeTruthy();
    expect(getByText('Skills')).toBeTruthy();
    expect(getByText('misc.tags.tagsManager.ungroupedHeader')).toBeTruthy();
  });
});
