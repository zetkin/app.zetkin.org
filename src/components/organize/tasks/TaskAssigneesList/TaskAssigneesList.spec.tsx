import mockAssignedTask from 'test-utils/mocks/mockAssignedTask';
import { render } from 'test-utils';
import singletonRouter from 'next/router';
import TaskAssigneesList from '.';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('TaskAssigneesList', () => {
    it('renders a list of assignees.', async () => {
        const task = mockAssignedTask();
        const task2 = mockAssignedTask({
            id: 2,
        });

        singletonRouter.query = {
            orgId: '1',
        };
        const { findAllByTestId } = render(<TaskAssigneesList assignedTasks={ [task, task2] } />);
        const assignees = await findAllByTestId('task-assignee');
        expect(assignees.length).toEqual(2);
    });
    it.skip('correctly sorts cards.', () => {
        //todo
    });
});
