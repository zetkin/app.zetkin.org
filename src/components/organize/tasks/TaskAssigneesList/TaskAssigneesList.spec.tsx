import { ASSIGNED_STATUS } from 'types/tasks';
import mockAssignedTask from 'test-utils/mocks/mockAssignedTask';
import { render } from 'test-utils';
import singletonRouter from 'next/router';
import TaskAssigneesList from '.';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

beforeEach(() => {
    singletonRouter.query = {
        orgId: '1',
    };
});

describe('TaskAssigneesList', () => {
    it('renders a list of assignees.', async () => {
        const task = mockAssignedTask();
        const task2 = mockAssignedTask({
            id: 2,
        });

        const { findAllByTestId } = render(<TaskAssigneesList assignedTasks={ [task, task2] } />);
        const assignees = await findAllByTestId('task-assignee');
        expect(assignees.length).toEqual(2);
    });
    it('correctly sorts assignees.', async () => {
        const task = mockAssignedTask();
        const task2 = mockAssignedTask({
            completed: '2021-012-18T12:50:01.469207',
            id: 2,
            status: ASSIGNED_STATUS.COMPLETED,
        });
        const task3 = mockAssignedTask({
            id: 3,
            status: ASSIGNED_STATUS.IGNORED,
        });

        const { findAllByTestId } = render(<TaskAssigneesList assignedTasks={ [task, task2, task3] } />);
        const assignees = await findAllByTestId('task-assignee');
        const status = ['completed', 'ignored', 'notCompleted'];

        assignees.forEach((assignee, index) => expect(assignee.innerHTML).toContain(status[index]));
    });
});
