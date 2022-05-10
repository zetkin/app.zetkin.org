import { click } from '@testing-library/user-event/dist/click';
import { hover } from '@testing-library/user-event/dist/hover';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { render } from 'utils/testing';
import singletonRouter from 'next/router';

import TagsManager from '.';

import mockTag from 'utils/testing/mocks/mockTag';
import { ZetkinTag } from 'types/zetkin';
import { EditTag, NewTag } from './types';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const assignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const createTagCallback = jest.fn((tag: NewTag) => tag);
const unassignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const editTagCallback = jest.fn((tag: EditTag) => tag);

describe('<TagsManager />', () => {
  describe('Renders list of tags passed in', () => {
    it('informs user if no tags applied', () => {
      const { getByText } = render(
        <TagsManager
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onCreateTag={createTagCallback}
          onEditTag={editTagCallback}
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
          availableGroups={[]}
          availableTags={[tag1, tag2]}
          onAssignTag={assignTagCallback}
          onCreateTag={createTagCallback}
          onEditTag={editTagCallback}
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
        availableGroups={[]}
        availableTags={tags}
        onAssignTag={assignTagCallback}
        onCreateTag={createTagCallback}
        onEditTag={editTagCallback}
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
        availableGroups={[]}
        availableTags={[tag1]}
        onAssignTag={onAssignTag}
        onCreateTag={createTagCallback}
        onEditTag={editTagCallback}
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
        availableGroups={[]}
        availableTags={[tag1]}
        onAssignTag={assignTagCallback}
        onCreateTag={createTagCallback}
        onEditTag={editTagCallback}
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

  describe('creating a tag', () => {
    let onCreateTag: jest.Mock<NewTag, [tag: NewTag]>;

    beforeEach(() => {
      onCreateTag = jest.fn((tag: NewTag) => tag);
      singletonRouter.query = {
        orgId: '1',
      };
    });

    it('passes the value in the tag search field in to the create tag', () => {
      const { getByTestId, getByText } = render(
        <TagsManager
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByText('misc.tags.tagsManager.addTag');
      click(addTagButton);

      const tagSearchField = getByTestId('TagManager-TagSelect-searchField');
      click(tagSearchField);
      keyboard("Jerry's family");

      const createTagOption = getByTestId(
        'TagManager-TagSelect-createTagOption'
      );
      click(createTagOption);

      const titleField = getByTestId('TagManager-TagDialog-titleField');
      expect((titleField as HTMLInputElement).value).toEqual("Jerry's family");
    });
  });

  describe('editing a tag', () => {
    let onCreateTag: jest.Mock<NewTag, [tag: NewTag]>;

    beforeEach(() => {
      onCreateTag = jest.fn((tag: NewTag) => tag);
      singletonRouter.query = {
        orgId: '1',
      };
    });

    it('can edit an existing tag in the tag dialog', () => {
      const tagToEdit = mockTag();

      const { getByTestId, getByText } = render(
        <TagsManager
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[tagToEdit]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByText('misc.tags.tagsManager.addTag');
      click(addTagButton);

      const editTagButton = getByTestId(
        `TagManager-TagSelect-editTag-${tagToEdit.id}`
      );
      click(editTagButton);

      const titleField = getByTestId('TagManager-TagDialog-titleField');
      expect((titleField as HTMLInputElement).value).toEqual(tagToEdit.title);
    });
  });
});
