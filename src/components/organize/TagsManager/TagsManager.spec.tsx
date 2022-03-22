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
    // it('shows colour applied to tags', () => {
    //   const tag1 = mockTag({ title: "Organiser", color: '#32a852' });
    //   const { getByText } = render(<TagsManager appliedTags={[tag1]} />);
    //   const tagEl = getByText('Organiser');
    //   expect(tagEl.style.backgroundColor).toEqual('#32a852');
    // });
  });
});
