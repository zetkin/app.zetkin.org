import { useSelector } from 'react-redux';

import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { RootState } from 'core/store';
import { useApiClient, useEnv } from 'core/hooks';
import { ZetkinTask } from '../components/types';
import getStats, { TaskStats } from '../rpc/getTaskStats';
import { taskLoad, taskLoaded, statsLoad, statsLoaded } from '../store';

interface UseTaskReturn {
  getTask: () => IFuture<ZetkinTask>;
  getTaskStats: () => IFuture<TaskStats>;
}

export default function useTask(orgId: number, taskId: number): UseTaskReturn {
  const apiClient = useApiClient();

  const state = useSelector((state: RootState) => state);
  const env = useEnv();

  const getTask = (): IFuture<ZetkinTask> => {
    const item = state.tasks.tasksList.items.find((item) => item.id === taskId);

    return loadItemIfNecessary(item, env.store, {
      actionOnLoad: () => taskLoad(taskId),
      actionOnSuccess: (data) => taskLoaded(data),
      loader: () =>
        apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}`),
    });
  };

  const getTaskStats = () => {
    const item = state.tasks.statsById[taskId];
    return loadItemIfNecessary(item, env.store, {
      actionOnLoad: () => statsLoad(taskId),
      actionOnSuccess: (data) => statsLoaded([taskId, data]),
      loader: () => apiClient.rpc(getStats, { orgId, taskId }),
    });
  };
  return { getTask, getTaskStats };
}
