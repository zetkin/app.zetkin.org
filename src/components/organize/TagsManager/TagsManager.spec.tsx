import { click } from '@testing-library/user-event/dist/click';
import { hover } from '@testing-library/user-event/dist/hover';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { render } from 'utils/testing';

import mockTag from 'utils/testing/mocks/mockTag';
import TagsManager from '.';
import { ZetkinTag } from 'types/zetkin';

const assignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const unassignTagCallback = jest.fn((tag: ZetkinTag) => tag);

describe('<TagsManager />', () => {
  describe('Renders list of tags passed in', () => {
    it('informs user if no tags applied', () => {
      const { getByText } = render(
        <TagsManager
          assignedTags={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );
      expect(getByText('misc.tags.tagsManager.noTags')).toBeTruthy();
    });
    it('shows tags that have been applied in the tags list', () => {
      const tag1 = mockTag({ title: 'Organizer' });
      const tag2 = mockTag({ id: 2, title: 'Activist' });
      const { getByText } = render(
        <TagsManager
          assignedTags={[tag1, tag2]}
          availableTags={[tag1, tag2]}
          onAssignTag={assignTagCallback}
          onUnassignTag={unassignTagCallback}
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
        assignedTags={tags}
        availableTags={tags}
        onAssignTag={assignTagCallback}
        onUnassignTag={unassignTagCallback}
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
  it('can add a tag', () => {
    const onAssignTag = jest.fn((tag: ZetkinTag) => tag);

    const tag1 = mockTag({
      group: { id: 2, title: 'Skills' },
      id: 4,
      title: 'Phone banking',
    });

    const { getByText } = render(
      <TagsManager
        assignedTags={[]}
        availableTags={[tag1]}
        onAssignTag={onAssignTag}
        onUnassignTag={unassignTagCallback}
      />
    );
    const addTagButton = getByText('misc.tags.tagsManager.addTag');
    click(addTagButton);

    // Typing searches for tag
    keyboard(tag1.title);

    // Select an option
    const tagOption = getByText('Phone banking');
    click(tagOption);

    // Check that callback has been called
    expect(onAssignTag).toHaveBeenCalledWith(tag1);
  });
  it('can remove a tag', () => {
    const onUnassignTag = jest.fn((tag: ZetkinTag) => tag);

    const tag1 = mockTag({
      group: { id: 2, title: 'Skills' },
      id: 4,
      title: 'Phone banking',
    });

    const { getByText, container } = render(
      <TagsManager
        assignedTags={[tag1]}
        availableTags={[tag1]}
        onAssignTag={assignTagCallback}
        onUnassignTag={onUnassignTag}
      />
    );

    // Hover tag to remove
    const tagOption = getByText('Phone banking');
    hover(tagOption);

    // Click delete button
    const removeTagButton = container.querySelector(`.MuiChip-deleteIcon`);
    expect(removeTagButton).not.toBeNull();
    if (removeTagButton) {
      click(removeTagButton);
    }

    // Check that callback has been called
    expect(onUnassignTag).toHaveBeenCalledWith(tag1);
  });
});
