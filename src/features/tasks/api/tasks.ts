import { ZetkinTaskRequestBody } from 'features/tasks/components/types';
import {
  createPrefetch,
  createUseMutation,
  createUseMutationDelete,
  createUseQuery,
} from 'utils/api/resourceHookFactories';

import { ZetkinAssignedTask, ZetkinTask } from 'utils/types/zetkin';

export const tasksResource = (orgId: string) => {
  const key = ['tasks', orgId];
  const url = `/orgs/${orgId}/tasks`;

  return {
    prefetch: createPrefetch(key, url),
    useDelete: createUseMutationDelete({ key, url }),
  };
};

export const campaignTasksResource = (orgId: string, campaignId: string) => {
  const key = ['tasks', orgId, campaignId];
  const url = `/orgs/${orgId}/campaigns/${campaignId}/tasks`;

  return {
    prefetch: createPrefetch(key, url),
    useQuery: createUseQuery<ZetkinTask[]>(key, url),
  };
};

export const taskResource = (orgId: string, taskId: string) => {
  const key = ['task', taskId];
  const url = `/orgs/${orgId}/tasks/${taskId}`;

  return {
    prefetch: createPrefetch<ZetkinTask>(key, url),
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
