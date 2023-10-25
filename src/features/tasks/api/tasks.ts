import { ZetkinTaskRequestBody } from 'features/tasks/components/types';
import {
  createUseMutation,
  createUseQuery,
} from 'utils/api/resourceHookFactories';

import { ZetkinAssignedTask, ZetkinTask } from 'utils/types/zetkin';

export const taskResource = (orgId: string, taskId: string) => {
  const key = ['task', taskId];
  const url = `/orgs/${orgId}/tasks/${taskId}`;

  return {
    useAssignedTasksQuery: createUseQuery<ZetkinAssignedTask[]>(
      ['assignedTasks', orgId, taskId],
      `/orgs/${orgId}/tasks/${taskId}/assigned`
    ),
    useQuery: createUseQuery<ZetkinTask>(key, url),
    useUpdate: createUseMutation<ZetkinTaskRequestBody, ZetkinTask>(key, url, {
      method: 'PATCH',
    }),
  };
};
