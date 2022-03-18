import { render } from 'utils/testing';
import TagsManager from '.';

describe('<TagsManager />', () => {
  describe('Renders list of tags passed in', () => {
    it.only('informs user if no tags applied', () => {
      const { getByText } = render(<TagsManager appliedTags={[]} />);
      expect(getByText('pages.people.person.tags.noTags')).toBeTruthy();
    });
    it('shows tags that have been applied in the tags list', () => {});
    it('shows colour applied to tags', () => {});
    it('displays a tooltip on hover if there is a description', () => {});
  });
});
