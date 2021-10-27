import { mockObject } from '.';
import { ASSIGNED_STATUS, ZetkinAssignedTask } from 'types/tasks';

const task: ZetkinAssignedTask =
    {
        assigned: '2021-08-20T12:55:01.469207',
        assignee: {
            first_name: 'Dolly',
            id: 2,
            last_name: 'Parton',
        },
        completed: null,
        id: 1,
        status: ASSIGNED_STATUS.ASSIGNED,
        task: {
            deadline: '2021-012-20T12:55:01.469207',
            expires: '2021-012-20T12:55:01.469207',
            id: 1,
            title: 'Fake title',
        },
    }
;

const mockAssignedTask = (overrides?: Partial<ZetkinAssignedTask >): ZetkinAssignedTask => {
    return mockObject(task, overrides);
};

export default mockAssignedTask;

export { task };
