import { click } from '@testing-library/user-event/dist/click';
import { keyboard } from '@testing-library/user-event/dist/keyboard';
import { render } from 'utils/testing';
import singletonRouter from 'next/router';

import { NewTag } from '../types';
import TagDialog from '.';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('<TagDialog />', () => {
  let onCreateTag: jest.Mock<NewTag, [tag: NewTag]>;

  beforeEach(() => {
    onCreateTag = jest.fn((tag: NewTag) => tag);
    singletonRouter.query = {
      orgId: '1',
    };
  });

  // it('creates a tag', () => {});

  it(`
      When creating a new group, sends the new group properties
      to the onCreateTag callback instead of groupId
    `, () => {
    const { getByTestId, getByText } = render(
      <TagDialog
        groups={[]}
        onClose={() => undefined}
        onSubmit={onCreateTag}
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
    expect(onCreateTag).toBeCalledWith({
      color: undefined,
      group: { title: 'New Group' },
      title: 'Tag Title',
    });
  });

  // describe('validation', () => {});
  // Validation
});
