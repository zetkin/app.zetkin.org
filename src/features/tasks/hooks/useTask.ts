import { useSelector } from 'react-redux';

import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { ZetkinTask } from '../components/types';
import { taskLoad, taskLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseTaskReturn {
  data: ZetkinTask | null;
}

export default function useTask(orgId: number, taskId: number): UseTaskReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const tasks = useSelector((state: RootState) => state.tasks);

  const item = tasks.tasksList.items.find((item) => item.id === taskId);

  const taskFuture = loadItemIfNecessary(item, env.store, {
    actionOnLoad: () => taskLoad(taskId),
    actionOnSuccess: (data) => taskLoaded(data),
    loader: () =>
      apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}`),
  });

  return {
    data: taskFuture.data,
  };
}
