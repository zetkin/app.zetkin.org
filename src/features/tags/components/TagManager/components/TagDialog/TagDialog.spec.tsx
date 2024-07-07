import singletonRouter from 'next/router';
import userEvent from '@testing-library/user-event';

import { render } from 'utils/testing';
import mockTag from 'utils/testing/mocks/mockTag';
import { EditTag, NewTag } from '../../types';
import messageIds from 'features/tags/l10n/messageIds';
import TagDialog from 'features/tags/components/TagManager/components/TagDialog';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('<TagDialog />', () => {
  let onSubmit: jest.Mock<NewTag | EditTag, [tag: NewTag | EditTag]>;
  const deleteTagCallback = jest.fn((tagId: number) => tagId);

  beforeEach(() => {
    onSubmit = jest.fn((tag: NewTag | EditTag) => tag);
    singletonRouter.query = {
      orgId: '1',
    };
  });

  it('creates a basic tag', async () => {
    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onDelete={deleteTagCallback}
        onSubmit={onSubmit}
        open={true}
      />
    );

    // Fill in dialog with paste, as keyboard is slow with many characters
    const titleField = getByTestId('TagManager-TagDialog-titleField');
    await userEvent.click(titleField);
    await userEvent.paste('Spongeworthy');

    const submit = getByTestId('SubmitCancelButtons-submitButton');
    await userEvent.click(submit);

    // Check new group object created
    expect(onSubmit).toBeCalledWith({
      color: undefined,
      group_id: null,
      title: 'Spongeworthy',
    });
  });

  it(`
      When creating a new group, sends the new group properties
      to the onSubmit callback instead of groupId
    `, async () => {
    const { getByTestId, getByMessageId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onDelete={deleteTagCallback}
        onSubmit={onSubmit}
        open={true}
      />
    );

    // Fill in dialog with paste, as keyboard is slow with many characters
    const titleField = getByTestId('TagManager-TagDialog-titleField');
    await userEvent.click(titleField);
    await userEvent.paste('Tag Title');

    const groupField = getByTestId('TagManager-TagDialog-tagGroupSelect');
    await userEvent.click(groupField);
    await userEvent.paste('New Group');
    const newGroupOption = getByMessageId(messageIds.dialog.groupCreatePrompt);
    await userEvent.click(newGroupOption);

    const submit = getByTestId('SubmitCancelButtons-submitButton');
    await userEvent.click(submit);

    // Check new group object created
    expect(onSubmit).toBeCalledWith({
      color: undefined,
      group: { title: 'New Group' },
      title: 'Tag Title',
    });
  });

  it('Requires valid inputs to submit', async () => {
    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onDelete={deleteTagCallback}
        onSubmit={onSubmit}
        open={true}
      />
    );

    // Submit is disabled
    const submit = getByTestId(
      'SubmitCancelButtons-submitButton'
    ) as HTMLButtonElement;
    expect(submit.disabled).toBeTruthy();

    const titleField = getByTestId('TagManager-TagDialog-titleField');
    const colorField = getByTestId('TagManager-TagDialog-colorField');

    // Enter title
    await userEvent.click(titleField);
    await userEvent.keyboard('Tag Title');

    // Submit enabled when title provided
    expect(submit.disabled).toBeFalsy();

    // Enter invalid color, submit should be disabled
    await userEvent.click(colorField);
    await userEvent.keyboard('a1');
    expect(submit.disabled).toBeTruthy();

    // Enter valid color, submit should be enabled
    await userEvent.keyboard('a1a1'); // Adds 4 more chars
    expect(submit.disabled).toBeFalsy();
  });

  test('can edit an existing tag', async () => {
    const title = 'New Tag';
    const color = 'a1a1a1';

    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onDelete={deleteTagCallback}
        onSubmit={onSubmit}
        open={true}
        tag={mockTag({ id: 1000, title })}
      />
    );

    // Modify color field
    const colorField = getByTestId('TagManager-TagDialog-colorField');
    await userEvent.click(colorField);
    await userEvent.keyboard(color);

    const submit = getByTestId('SubmitCancelButtons-submitButton');
    await userEvent.click(submit);

    // Check correct fields returned with tag id.
    expect(onSubmit).toBeCalledWith({
      color: `#${color}`,
      group_id: null,
      id: 1000,
      title: title,
    });
  });

  it('disables TypeSelect when editing a tag', () => {
    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onDelete={deleteTagCallback}
        onSubmit={onSubmit}
        open={true}
        tag={mockTag({ id: 1000, title: 'Value tag', value_type: 'text' })}
      />
    );

    const radioGroup = getByTestId('TypeSelect-formControl');
    const input = radioGroup.querySelector('input');
    expect(input?.getAttribute('disabled')).not.toBeNull();
  });
});
