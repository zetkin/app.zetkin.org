import { click } from '@testing-library/user-event/dist/click';
import { hover } from '@testing-library/user-event/dist/hover';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { render } from 'utils/testing';
import singletonRouter from 'next/router';

import { TagManagerController } from './TagManagerController';

import mockTag from 'utils/testing/mocks/mockTag';
import { ZetkinTag } from 'types/zetkin';
import { EditTag, NewTag } from './types';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const assignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const createTagCallback = jest.fn<Promise<ZetkinTag>, [NewTag]>((tag) =>
  Promise.resolve({ ...tag, id: 1 } as ZetkinTag)
);
const unassignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const editTagCallback = jest.fn((tag: EditTag) => tag);

describe('<TagManagerController />', () => {
  describe('Renders list of tags passed in', () => {
    it('shows tags that have been applied in the tags list', () => {
      const tag1 = mockTag({ title: 'Organizer' });
      const tag2 = mockTag({ id: 2, title: 'Activist' });
      const { getByText } = render(
        <TagManagerController
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
  it('groups tags passed tagsGrouped prop', () => {
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
      <TagManagerController
        assignedTags={tags}
        availableGroups={[]}
        availableTags={tags}
        groupTags
        onAssignTag={assignTagCallback}
        onCreateTag={createTagCallback}
        onEditTag={editTagCallback}
        onUnassignTag={unassignTagCallback}
      />
    );

    expect(getByText('Political')).toBeTruthy();
    expect(getByTestId('TagManager-groupedTags-1').children.length).toEqual(2);

    expect(getByText('Skills')).toBeTruthy();
    expect(getByTestId('TagManager-groupedTags-2').children.length).toEqual(3);

    expect(getByText('misc.tags.tagManager.ungroupedHeader')).toBeTruthy();
    expect(
      getByTestId('TagManager-groupedTags-ungrouped').children.length
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
      <TagManagerController
        assignedTags={[]}
        availableGroups={[]}
        availableTags={[tag1]}
        onAssignTag={onAssignTag}
        onCreateTag={createTagCallback}
        onEditTag={editTagCallback}
        onUnassignTag={unassignTagCallback}
      />
    );
    const addTagButton = getByText('misc.tags.tagManager.addTag');
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
      <TagManagerController
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
    const removeTagButton = container.querySelector(
      '[data-testid=TagChip-deleteButton]'
    );
    expect(removeTagButton).not.toBeNull();
    if (removeTagButton) {
      click(removeTagButton);
    }

    // Check that callback has been called
    expect(onUnassignTag).toHaveBeenCalledWith(tag1);
  });

  describe('creating a tag', () => {
    let onCreateTag: jest.Mock<Promise<ZetkinTag>, [tag: NewTag]>;

    beforeEach(() => {
      onCreateTag = jest.fn((tag: NewTag) => Promise.resolve(tag as ZetkinTag));
      singletonRouter.query = {
        orgId: '1',
      };
    });

    it('passes the value in the tag search field in to the create tag', () => {
      const { getByTestId, getByText } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByText('misc.tags.tagManager.addTag');
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
    let onCreateTag: jest.Mock<Promise<ZetkinTag>, [tag: NewTag]>;

    beforeEach(() => {
      onCreateTag = jest.fn((tag: NewTag) => Promise.resolve(tag as ZetkinTag));
      singletonRouter.query = {
        orgId: '1',
      };
    });

    it('does not show edit button for tag when `disableEditTags` set', () => {
      const tagToEdit = mockTag();

      const { getByTestId, getByText } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[tagToEdit]}
          disableEditTags
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByText('misc.tags.tagManager.addTag');
      click(addTagButton);

      // Expect to not find edit button
      expect(() =>
        getByTestId(`TagManager-TagSelect-editTag-${tagToEdit.id}`)
      ).toThrowError();
    });

    it('can edit an existing tag in the tag dialog', () => {
      const tagToEdit = mockTag();

      const { getByTestId, getByText } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[tagToEdit]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByText('misc.tags.tagManager.addTag');
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
