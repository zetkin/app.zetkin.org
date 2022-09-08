import { mockObject } from '.';
import mockPerson from './mockPerson';
import {
  ASSIGNED_STATUS,
  ZetkinAssignedTask,
} from 'features/tasks/components/types';

const task: ZetkinAssignedTask = {
  assigned: '2021-08-20T12:55:01.469207',
  assignee: mockPerson(),
  completed: null,
  id: 1,
  ignored: null,
  status: ASSIGNED_STATUS.ASSIGNED,
  task: {
    deadline: '2021-12-20T12:55:01.469207',
    expires: '2021-12-20T12:55:01.469207',
    id: 1,
    title: 'Fake title',
  },
};
const mockAssignedTask = (
  overrides?: Partial<ZetkinAssignedTask>
): ZetkinAssignedTask => {
  return mockObject(task, overrides);
};

export default mockAssignedTask;

export { task };
