import { createUseMutation } from 'utils/api/resourceHookFactories';
import { ZetkinTaskRequestBody } from 'features/tasks/components/types';
import { ZetkinTask } from 'utils/types/zetkin';

export const taskResource = (orgId: string, taskId: string) => {
  const key = ['task', taskId];
  const url = `/orgs/${orgId}/tasks/${taskId}`;

  return {
    useUpdate: createUseMutation<ZetkinTaskRequestBody, ZetkinTask>(key, url, {
      method: 'PATCH',
    }),
  };
};
