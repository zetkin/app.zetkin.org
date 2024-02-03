import { ASSIGNED_STATUS } from 'features/tasks/components/types';
import mockAssignedTask from 'utils/testing/mocks/mockAssignedTask';
import { render } from 'utils/testing';
import singletonRouter from 'next/router';
import TaskStatusSubtitle from './TaskStatusSubtitle';

import messageIds from 'features/tasks/l10n/messageIds';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
  singletonRouter.query = {
    orgId: '1',
  };
});

describe('TaskStatusSubtitle', () => {
  it('shows not completed status.', () => {
    const task = mockAssignedTask();

    const { getByMessageId } = render(<TaskStatusSubtitle task={task} />);
    const notCompletedSubtitle = getByMessageId(
      messageIds.assignees.completedStates.notCompleted
    );
    expect(notCompletedSubtitle).not.toBeNull();
  });
  it('shows ignored status.', () => {
    const task = mockAssignedTask({
      ignored: '2021-11-21T1:50:01.4692072',
      status: ASSIGNED_STATUS.IGNORED,
    });

    const { getByMessageId } = render(<TaskStatusSubtitle task={task} />);
    const ignoredSubtitle = getByMessageId(
      messageIds.assignees.completedStates.ignored
    );
    expect(ignoredSubtitle).not.toBeNull();
  });
  it('shows completed status.', () => {
    const task = mockAssignedTask({
      completed: '2021-12-18T12:50:01.469207',
      status: ASSIGNED_STATUS.COMPLETED,
    });

    const { getByMessageId } = render(<TaskStatusSubtitle task={task} />);
    const completedSubtitle = getByMessageId(
      messageIds.assignees.completedStates.completed
    );
    expect(completedSubtitle).not.toBeNull();
  });
});
