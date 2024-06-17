import singletonRouter from 'next/router';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

import messageIds from 'features/tags/l10n/messageIds';
import mockTag from 'utils/testing/mocks/mockTag';
import { render } from 'utils/testing';
import { TagManagerController } from './TagManagerController';
import { ZetkinTag } from 'utils/types/zetkin';
import { EditTag, NewTag } from './types';

jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('features/user/hooks/useCurrentUser');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

const assignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const createTagCallback = jest.fn<Promise<ZetkinTag>, [NewTag]>((tag) =>
  Promise.resolve({ ...tag, id: 1 } as ZetkinTag)
);
const unassignTagCallback = jest.fn((tag: ZetkinTag) => tag);
const editTagCallback = jest.fn((tag: EditTag) => tag);
const deleteTagCallback = jest.fn((tagId: number) => tagId);

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
          onDeleteTag={deleteTagCallback}
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
    const { getByTestId, getByMessageId, getByText } = render(
      <TagManagerController
        assignedTags={tags}
        availableGroups={[]}
        availableTags={tags}
        groupTags
        onAssignTag={assignTagCallback}
        onCreateTag={createTagCallback}
        onDeleteTag={deleteTagCallback}
        onEditTag={editTagCallback}
        onUnassignTag={unassignTagCallback}
      />
    );

    expect(getByText('Political')).toBeTruthy();
    expect(getByTestId('TagManager-groupedTags-1').children.length).toEqual(2);

    expect(getByText('Skills')).toBeTruthy();
    expect(getByTestId('TagManager-groupedTags-2').children.length).toEqual(3);

    expect(getByMessageId(messageIds.manager.ungroupedHeader)).toBeTruthy();
    expect(
      getByTestId('TagManager-groupedTags-ungrouped').children.length
    ).toEqual(2);
  });
  it('can add a tag', async () => {
    const onAssignTag = jest.fn((tag: ZetkinTag) => tag);

    const tag1 = mockTag({
      group: { id: 2, title: 'Skills' },
      id: 4,
      title: 'Phone banking',
    });

    const { getByMessageId, getByText } = render(
      <TagManagerController
        assignedTags={[]}
        availableGroups={[]}
        availableTags={[tag1]}
        onAssignTag={onAssignTag}
        onCreateTag={createTagCallback}
        onDeleteTag={deleteTagCallback}
        onEditTag={editTagCallback}
        onUnassignTag={unassignTagCallback}
      />
    );
    const addTagButton = getByMessageId(messageIds.manager.addTag);
    await userEvent.click(addTagButton);

    // Typing searches for tag
    await userEvent.keyboard(tag1.title);

    // Select an option
    const tagOption = getByText('Phone banking');
    await userEvent.click(tagOption);

    // Check that callback has been called
    expect(onAssignTag).toHaveBeenCalledWith(tag1);
  });
  it('can add a value tag', async () => {
    const onAssignTag = jest.fn((tag: ZetkinTag) => tag);

    const tag = mockTag({
      group: null,
      id: 1857,
      title: 'Age',
      value_type: 'text',
    });

    const { getByMessageId, getByTestId, getByText } = render(
      <TagManagerController
        assignedTags={[]}
        availableGroups={[]}
        availableTags={[tag]}
        onAssignTag={onAssignTag}
        onCreateTag={createTagCallback}
        onDeleteTag={deleteTagCallback}
        onEditTag={editTagCallback}
        onUnassignTag={unassignTagCallback}
      />
    );
    const addTagButton = getByMessageId(messageIds.manager.addTag);
    await userEvent.click(addTagButton);

    // Typing searches for tag
    await userEvent.keyboard(tag.title);

    // Select an option
    const tagOption = getByText(tag.title);
    await userEvent.click(tagOption);

    // Check that callback has not been called yet
    expect(onAssignTag).not.toHaveBeenCalled();

    // Check that we're in value mode
    const input = getByTestId('TagManager-TagSelect-searchField');
    expect(input.getAttribute('placeholder')).toEqual(
      'feat.tags.manager.addValue'
    );

    // Add value
    await userEvent.click(input);
    await userEvent.keyboard('75{Enter}');

    // Check that tag was assigned with value
    expect(onAssignTag).toHaveBeenCalledWith({
      ...tag,
      value: '75',
    });
  });
  it('can remove a tag', async () => {
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
        onDeleteTag={deleteTagCallback}
        onEditTag={editTagCallback}
        onUnassignTag={onUnassignTag}
      />
    );

    // Hover tag to remove
    const tagOption = getByText('Phone banking');
    await userEvent.hover(tagOption);

    // Click delete button
    const removeTagButton = container.querySelector(
      '[data-testid=TagChip-deleteButton]'
    );
    expect(removeTagButton).not.toBeNull();
    if (removeTagButton) {
      await userEvent.click(removeTagButton);
    }

    // Check that callback has been called
    expect(onUnassignTag).toHaveBeenCalledWith(tag1);
  });

  describe('creating a tag', () => {
    let onCreateTag: jest.Mock<Promise<ZetkinTag>, [tag: NewTag]>;

    beforeEach(() => {
      onCreateTag = jest.fn((tag: NewTag) =>
        Promise.resolve({ ...tag, id: 1857 } as ZetkinTag)
      );
      assignTagCallback.mockReset();
      singletonRouter.query = {
        orgId: '1',
      };
    });

    it('passes the value in the tag search field in to the create tag', async () => {
      const { getByTestId, getByMessageId } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onDeleteTag={deleteTagCallback}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByMessageId(messageIds.manager.addTag);
      await userEvent.click(addTagButton);

      const tagSearchField = getByTestId('TagManager-TagSelect-searchField');
      await userEvent.click(tagSearchField);
      await userEvent.keyboard("Jerry's family");

      const createTagOption = getByTestId(
        'TagManager-TagSelect-createTagOption'
      );
      await userEvent.click(createTagOption);

      const titleField = getByTestId('TagManager-TagDialog-titleField');
      expect((titleField as HTMLInputElement).value).toEqual("Jerry's family");
    });

    it('invokes onCreateTag() and onAssignTag() when creating a tag', async () => {
      const { getByTestId, getByMessageId } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onDeleteTag={deleteTagCallback}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      // Open create dialog
      await userEvent.click(getByMessageId(messageIds.manager.addTag));
      await userEvent.click(
        getByTestId('TagManager-TagSelect-createTagOption')
      );

      // Fill in dialog
      const titleField = getByTestId('TagManager-TagDialog-titleField');
      await userEvent.click(titleField);
      await userEvent.keyboard('Spongeworthy');

      const submit = getByTestId('SubmitCancelButtons-submitButton');
      await userEvent.click(submit);

      await waitFor(() => expect(onCreateTag).toBeCalled());
      expect(assignTagCallback).toBeCalled();

      const input = getByTestId('TagManager-TagSelect-searchField');
      expect(input.getAttribute('value')).toEqual('');
      expect(input.getAttribute('placeholder')).toEqual(
        'feat.tags.manager.addTag'
      );
    });

    it('comes back to value tag state without onAssignTag() after creating value tag', async () => {
      const { getByTestId, getByMessageId } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onDeleteTag={deleteTagCallback}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      // Open create dialog
      await userEvent.click(getByMessageId(messageIds.manager.addTag));
      await userEvent.click(
        getByTestId('TagManager-TagSelect-createTagOption')
      );

      // Fill in dialog
      const titleField = getByTestId('TagManager-TagDialog-titleField');
      await userEvent.click(titleField);
      await userEvent.keyboard('Age');

      // Set value type
      const radioGroup = getByTestId('TypeSelect-formControl');
      const textRadio = radioGroup.querySelector('input[value=text]');
      await userEvent.click(textRadio!);

      const submit = getByTestId('SubmitCancelButtons-submitButton');
      await userEvent.click(submit);

      await waitFor(() => expect(onCreateTag).toBeCalled());

      const input = getByTestId('TagManager-TagSelect-searchField');
      expect(input.getAttribute('placeholder')).toEqual(
        'feat.tags.manager.addValue'
      );

      expect(assignTagCallback).not.toBeCalled();

      await userEvent.click(input);
      await userEvent.keyboard('75{Enter}');

      await waitFor(() =>
        expect(assignTagCallback).toBeCalledWith({
          group_id: null,
          id: 1857,
          title: 'Age',
          value: '75',
          value_type: 'text',
        })
      );
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

    it('does not show edit button for tag when `disableEditTags` set', async () => {
      const tagToEdit = mockTag();

      const { getByTestId, getByMessageId } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[tagToEdit]}
          disableEditTags
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onDeleteTag={deleteTagCallback}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByMessageId(messageIds.manager.addTag);
      await userEvent.click(addTagButton);

      // Expect to not find edit button
      expect(() =>
        getByTestId(`TagManager-TagSelect-editTag-${tagToEdit.id}`)
      ).toThrowError();
    });

    it('can edit an existing tag in the tag dialog', async () => {
      const tagToEdit = mockTag();

      const { getByTestId, getByMessageId } = render(
        <TagManagerController
          assignedTags={[]}
          availableGroups={[]}
          availableTags={[tagToEdit]}
          onAssignTag={assignTagCallback}
          onCreateTag={onCreateTag}
          onDeleteTag={deleteTagCallback}
          onEditTag={editTagCallback}
          onUnassignTag={unassignTagCallback}
        />
      );

      const addTagButton = getByMessageId(messageIds.manager.addTag);
      await userEvent.click(addTagButton);

      const editTagButton = getByTestId(
        `TagManager-TagSelect-editTag-${tagToEdit.id}`
      );
      await userEvent.click(editTagButton);

      const titleField = getByTestId('TagManager-TagDialog-titleField');
      expect((titleField as HTMLInputElement).value).toEqual(tagToEdit.title);
    });
  });
});
