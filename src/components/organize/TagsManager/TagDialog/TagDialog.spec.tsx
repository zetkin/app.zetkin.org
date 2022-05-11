import { click } from '@testing-library/user-event/dist/click';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { render } from 'utils/testing';
import singletonRouter from 'next/router';

import mockTag from 'utils/testing/mocks/mockTag';
import { EditTag, NewTag } from '../types';

import TagDialog from '.';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('<TagDialog />', () => {
  let onSubmit: jest.Mock<NewTag | EditTag, [tag: NewTag | EditTag]>;

  beforeEach(() => {
    onSubmit = jest.fn((tag: NewTag | EditTag) => tag);
    singletonRouter.query = {
      orgId: '1',
    };
  });

  it('creates a basic tag', () => {
    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onSubmit={onSubmit}
        open={true}
      />
    );

    // Fill in dialog
    const titleField = getByTestId('TagManager-TagDialog-titleField');
    click(titleField);
    keyboard('Spongeworthy');

    const submit = getByTestId('submit-button');
    click(submit);

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
    `, () => {
    const { getByTestId, getByText } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onSubmit={onSubmit}
        open={true}
      />
    );

    // Fill in dialog
    const titleField = getByTestId('TagManager-TagDialog-titleField');
    click(titleField);
    keyboard('Tag Title');

    const groupField = getByTestId('TagManager-TagDialog-tagGroupSelect');
    click(groupField);
    keyboard('New Group');
    const newGroupOption = getByText(
      'misc.tags.tagsManager.tagDialog.groupCreatePrompt'
    );
    click(newGroupOption);

    const submit = getByTestId('submit-button');
    click(submit);

    // Check new group object created
    expect(onSubmit).toBeCalledWith({
      color: undefined,
      group: { title: 'New Group' },
      title: 'Tag Title',
    });
  });

  it('Requires valid inputs to submit', () => {
    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onSubmit={onSubmit}
        open={true}
      />
    );

    // Submit is disabled
    const submit = getByTestId('submit-button') as HTMLButtonElement;
    expect(submit.disabled).toBeTruthy();

    const titleField = getByTestId('TagManager-TagDialog-titleField');
    const colorField = getByTestId('TagManager-TagDialog-colorField');

    // Enter title
    click(titleField);
    keyboard('Tag Title');

    // Submit enabled when title provided
    expect(submit.disabled).toBeFalsy();

    // Enter invalid color, submit should be disabled
    click(colorField);
    keyboard('a1');
    expect(submit.disabled).toBeTruthy();

    // Enter valid color, submit should be enabled
    keyboard('a1a1'); // Adds 4 more chars
    expect(submit.disabled).toBeFalsy();
  });

  test('can edit an existing tag', () => {
    const title = 'New Tag';
    const color = 'a1a1a1';

    const { getByTestId } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onSubmit={onSubmit}
        open={true}
        tag={mockTag({ id: 1000, title })}
      />
    );

    // Modify color field
    const colorField = getByTestId('TagManager-TagDialog-colorField');
    click(colorField);
    keyboard(color);

    const submit = getByTestId('submit-button');
    click(submit);

    // Check correct fields returned with tag id.
    expect(onSubmit).toBeCalledWith({
      color: `#${color}`,
      group_id: null,
      id: 1000,
      title: title,
    });
  });
});
