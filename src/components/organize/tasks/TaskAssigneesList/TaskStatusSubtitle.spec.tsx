import { ASSIGNED_STATUS } from 'types/tasks';
import mockAssignedTask from 'test-utils/mocks/mockAssignedTask';
import { render } from 'test-utils';
import singletonRouter from 'next/router';
import TaskStatusSubtitle from './TaskStatusSubtitle';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
    singletonRouter.query = {
        orgId: '1',
    };
});

describe('TaskStatusSubtitle', () => {
    it('shows not completed status.', () => {
        const task = mockAssignedTask();

        const { getByText } = render(<TaskStatusSubtitle task={ task } />);
        const notCompletedSubtitle = getByText('misc.tasks.taskAssigneesList.completedStates.notCompleted');
        expect(notCompletedSubtitle).not.toBeNull();
    });
    it('shows ignored status.', () => {
        const task = mockAssignedTask({
            ignored: '2021-11-21T1:50:01.4692072',
            status: ASSIGNED_STATUS.IGNORED,
        });

        const { getByText } = render(<TaskStatusSubtitle task={ task } />);
        const ignoredSubtitle = getByText('misc.tasks.taskAssigneesList.completedStates.ignored');
        expect(ignoredSubtitle).not.toBeNull();
    });
    it('shows completed status.', () => {
        const task = mockAssignedTask({
            completed: '2021-12-18T12:50:01.469207',
            status: ASSIGNED_STATUS.COMPLETED,
        });

        const { getByText } = render(<TaskStatusSubtitle task={ task } />);
        const completedSubtitle = getByText('misc.tasks.taskAssigneesList.completedStates.completed');
        expect(completedSubtitle).not.toBeNull();
    });
});
