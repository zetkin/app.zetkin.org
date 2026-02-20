import userEvent from '@testing-library/user-event';

import messageIds from 'features/tags/l10n/messageIds';
import TagGroupDialog from 'features/tags/components/TagManager/components/TagGroupDialog';
import { ZetkinTagGroup } from 'utils/types/zetkin';
import { render } from 'utils/testing';
import mockOrganization from 'utils/testing/mocks/mockOrganization';
import { ZetkinTagGroupPatchBody } from 'features/tags/components/TagManager/types';

describe('<TagGroupDialog />', () => {
  let onSubmit: jest.Mock<
    ZetkinTagGroupPatchBody,
    [group: ZetkinTagGroupPatchBody]
  >;
  const onClose = jest.fn();
  const deleteGroupCallback = jest.fn((groupId: number) => groupId);

  const group: ZetkinTagGroup = {
    id: 100,
    organization: mockOrganization(),
    title: 'Original group title',
  };

  beforeEach(() => {
    onSubmit = jest.fn((body: ZetkinTagGroupPatchBody) => body);
    onClose.mockClear();
    deleteGroupCallback.mockClear();
  });

  it('is prefilled and can submit updated group title (edit only)', async () => {
    const { getByTestId } = render(
      <TagGroupDialog
        group={group}
        onClose={onClose}
        onDelete={deleteGroupCallback}
        onSubmit={onSubmit}
        open={true}
      />
    );

    const titleField = getByTestId(
      'TagManager-TagGroupDialog-titleField'
    ) as HTMLInputElement;

    // Prefilled from `group`
    expect(titleField.value).toBe(group.title);

    // Change title
    await userEvent.click(titleField);
    await userEvent.clear(titleField);
    await userEvent.paste('Updated title');

    const submit = getByTestId('SubmitCancelButtons-submitButton');
    await userEvent.click(submit);

    expect(onSubmit).toHaveBeenCalledWith({
      id: group.id,
      title: 'Updated title',
    });
  });

  it('requires a non-empty title to submit', async () => {
    const { getByTestId } = render(
      <TagGroupDialog
        group={group}
        onClose={onClose}
        onDelete={deleteGroupCallback}
        onSubmit={onSubmit}
        open={true}
      />
    );

    const titleField = getByTestId(
      'TagManager-TagGroupDialog-titleField'
    ) as HTMLInputElement;

    const submit = getByTestId(
      'SubmitCancelButtons-submitButton'
    ) as HTMLButtonElement;

    // Starts enabled because group title is prefilled
    expect(submit.disabled).toBeFalsy();

    // Clear title -> submit disabled
    await userEvent.click(titleField);
    await userEvent.clear(titleField);
    expect(submit.disabled).toBeTruthy();

    // Enter title -> submit enabled again
    await userEvent.paste('A title');
    expect(submit.disabled).toBeFalsy();
  });

  it('calls onDelete with group id when clicking delete', async () => {
    const { getByMessageId } = render(
      <TagGroupDialog
        group={group}
        onClose={onClose}
        onDelete={deleteGroupCallback}
        onSubmit={onSubmit}
        open={true}
      />
    );

    const deleteButton = getByMessageId(messageIds.dialog.deleteButtonLabel);
    await userEvent.click(deleteButton);

    expect(deleteGroupCallback).toHaveBeenCalledWith(group.id);
  });
});
