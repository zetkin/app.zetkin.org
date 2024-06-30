import singletonRouter from 'next/router';

import { ASSIGNED_STATUS } from 'features/tasks/components/types';
import mockAssignedTask from 'utils/testing/mocks/mockAssignedTask';
import { render } from 'utils/testing';
import TaskAssigneesList from 'features/tasks/components/TaskAssigneesList';

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

    const { findAllByTestId } = render(
      <TaskAssigneesList assignedTasks={[task, task2]} />
    );
    const assignees = await findAllByTestId('task-assignee');
    expect(assignees.length).toEqual(2);
  });
  it('correctly sorts assignees.', async () => {
    const task1 = mockAssignedTask({
      assignee: {
        first_name: 'Pamela',
        id: 1,
        last_name: 'Anderson',
      },
      completed: '2021-12-18T12:50:01.469207',
      id: 1,
      status: ASSIGNED_STATUS.COMPLETED,
    });
    const task2 = mockAssignedTask({
      assignee: {
        first_name: 'Dolly',
        id: 2,
        last_name: 'Parton',
      },
      completed: '2021-12-16T12:50:01.469207',
      id: 2,
      status: ASSIGNED_STATUS.COMPLETED,
    });
    const task3 = mockAssignedTask({
      assigned: '2021-11-18T12:50:01.469207',
      assignee: {
        first_name: 'Anna Nicole',
        id: 3,
        last_name: 'Smith',
      },
      id: 3,
      ignored: '2021-11-21T12:50:01.469207',
      status: ASSIGNED_STATUS.IGNORED,
    });
    const task4 = mockAssignedTask({
      assigned: '2021-11-16T12:50:01.469207',
      assignee: {
        first_name: 'Trisha',
        id: 4,
        last_name: 'Paytas',
      },
      id: 4,
      ignored: '2021-11-19T12:50:01.469207',
      status: ASSIGNED_STATUS.IGNORED,
    });
    const task5 = mockAssignedTask({
      assigned: '2021-11-20T12:50:01.469207',
      assignee: {
        first_name: 'Barb',
        id: 5,
        last_name: 'Wire',
      },
      id: 5,
    });
    const task6 = mockAssignedTask({
      assigned: '2021-11-19T12:50:01.469207',
      assignee: {
        first_name: 'Nicholas',
        id: 6,
        last_name: 'Cage',
      },
      id: 6,
    });

    const { findAllByTestId } = render(
      <TaskAssigneesList
        assignedTasks={[task2, task5, task4, task1, task6, task3]}
      />
    );
    const assignees = await findAllByTestId('task-assignee');

    expect(assignees[0].innerHTML).toContain('Pamela Anderson');
    expect(assignees[1].innerHTML).toContain('Dolly Parton');
    expect(assignees[2].innerHTML).toContain('Anna Nicole Smith');
    expect(assignees[3].innerHTML).toContain('Trisha Paytas');
    expect(assignees[4].innerHTML).toContain('Barb Wire');
    expect(assignees[5].innerHTML).toContain('Nicholas Cage');
  });
});
