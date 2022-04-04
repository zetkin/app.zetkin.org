import { click } from '@testing-library/user-event/dist/click';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { render } from 'utils/testing';

import mockTag from 'utils/testing/mocks/mockTag';
import TagsManager from '.';
import { ZetkinTag } from 'types/zetkin';

const selectTagCallback = jest.fn((tag: ZetkinTag) => tag);

describe('<TagsManager />', () => {
  describe('Renders list of tags passed in', () => {
    it('informs user if no tags applied', () => {
      const { getByText } = render(
        <TagsManager
          appliedTags={[]}
          availableTags={[]}
          onSelect={selectTagCallback}
        />
      );
      expect(getByText('misc.tags.tagsManager.noTags')).toBeTruthy();
    });
    it('shows tags that have been applied in the tags list', () => {
      const tag1 = mockTag({ title: 'Organizer' });
      const tag2 = mockTag({ id: 2, title: 'Activist' });
      const { getByText } = render(
        <TagsManager
          appliedTags={[tag1, tag2]}
          availableTags={[tag1, tag2]}
          onSelect={selectTagCallback}
        />
      );
      expect(getByText('Organizer')).toBeTruthy();
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
      mockTag({
        group: { id: 2, title: 'Skills' },
        id: 4,
        title: 'Phone banking',
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
      <TagsManager
        appliedTags={tags}
        availableTags={tags}
        onSelect={selectTagCallback}
      />
    );
    const toggle = getByTestId('TagsManager-groupToggle').firstChild
      ?.firstChild as Element & { disabled: boolean };
    expect(toggle.disabled).toBeFalsy();
    click(toggle);

    expect(getByText('Political')).toBeTruthy();
    expect(getByTestId('TagsManager-groupedTags-1').children.length).toEqual(2);

    expect(getByText('Skills')).toBeTruthy();
    expect(getByTestId('TagsManager-groupedTags-2').children.length).toEqual(3);

    expect(getByText('misc.tags.tagsManager.ungroupedHeader')).toBeTruthy();
    expect(
      getByTestId('TagsManager-groupedTags-ungrouped').children.length
    ).toEqual(2);
  });
  it('can add tag', () => {
    const onSelect = jest.fn((tag: ZetkinTag) => tag);

    const tag1 = mockTag({
      group: { id: 2, title: 'Skills' },
      id: 4,
      title: 'Phone banking',
    });

    const { getByText, getByTestId } = render(
      <TagsManager
        appliedTags={[]}
        availableTags={[tag1]}
        onSelect={onSelect}
      />
    );
    const addTagButton = getByText('misc.tags.tagsManager.addTag');
    click(addTagButton);

    // Click on input
    const tagSearch = getByTestId('TagsManager-tagSelectTextField');
    click(tagSearch);

    // Typing searches for tag
    keyboard(tag1.title);

    // Select an option
    const tagOption = getByText('Phone banking');
    click(tagOption);

    // Check that callback has been called
    expect(onSelect).toHaveBeenCalledWith(tag1);
  });
});
