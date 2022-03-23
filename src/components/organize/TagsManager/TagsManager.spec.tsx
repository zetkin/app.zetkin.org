import { click } from '@testing-library/user-event/dist/click';
import { render } from 'utils/testing';

import mockTag from 'utils/testing/mocks/mockTag';
import TagsManager from '.';

describe('<TagsManager />', () => {
  describe('Renders list of tags passed in', () => {
    it('informs user if no tags applied', () => {
      const { getByText } = render(<TagsManager appliedTags={[]} />);
      expect(getByText('pages.people.person.tags.noTags')).toBeTruthy();
    });
    it('shows tags that have been applied in the tags list', () => {
      const tag1 = mockTag({ title: 'Organiser' });
      const tag2 = mockTag({ id: 2, title: 'Activist' });
      const { getByText } = render(<TagsManager appliedTags={[tag1, tag2]} />);
      expect(getByText('Organiser')).toBeTruthy();
      expect(getByText('Activist')).toBeTruthy();
    });
  });
  describe.only('Can group tags', () => {
    it('shows a disabled toggle if no tags with a group', () => {
      const { getByTestId } = render(
        <TagsManager appliedTags={[mockTag(), mockTag({ id: 2 })]} />
      );
      const toggle = getByTestId('TagsManager-groupToggle').firstChild
        ?.firstChild as Element & { disabled: boolean };
      expect(toggle.disabled).toBeTruthy();
    });
    it('groups tags when clicking toggle', () => {
      const tags = [mockTag(), mockTag({ id: 2 })];
      const { getByTestId } = render(<TagsManager appliedTags={tags} />);
      const toggle = getByTestId('TagsManager-groupToggle').firstChild
        ?.firstChild as Element & { disabled: boolean };
      click(toggle);
      // Toggle should be enabled
      expect(toggle.disabled).toBeFalsy();
    });
  });
});
