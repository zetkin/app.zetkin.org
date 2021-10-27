import { render } from 'test-utils';
import singletonRouter from 'next/router';
import TaskAssigneesList from '.';
import {  ASSIGNED_STATUS, ZetkinAssignedTask } from 'types/tasks';

const tasks : ZetkinAssignedTask[] = [
    {
        assigned: '2021-08-20T12:55:01.469207',
        assignee: {
            first_name: 'Dolly',
            id: 2,
            last_name: 'Parton',
        },
        completed: null,
        id: 1,
        status: ASSIGNED_STATUS.COMPLETED,
        task: {
            deadline: '2021-012-20T12:55:01.469207',
            expires: '2021-012-20T12:55:01.469207',
            id: 1,
            title: 'Fake title',
        },
    },
];

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('TaskAssigneesList', () => {
    it('renders a list of assignees.', async () => {
        singletonRouter.query = {
            orgId: '1',
        };
        const { findAllByTestId } = render(<TaskAssigneesList assignedTasks={ tasks } />);
        const assignees = await findAllByTestId('task-assignee');
        expect(assignees.length).toEqual(1);
    });
    it.skip('correctly sorts cards.', () => {
        //todo
    });
});
