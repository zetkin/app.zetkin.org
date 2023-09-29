import { useSelector } from 'react-redux';

import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import getStats, { TaskStats } from '../rpc/getTaskStats';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseTaskStatsReturn {
  data: TaskStats | null;
  isLoading: boolean;
}

export default function useTaskStats(
  orgId: number,
  taskId: number
): UseTaskStatsReturn {
  const apiClient = useApiClient();
  const env = useEnv();
  const tasks = useSelector((state: RootState) => state.tasks);

  const item = tasks.statsById[taskId!];

  const taskStatsFuture = loadItemIfNecessary(item, env.store, {
    actionOnLoad: () => statsLoad(taskId!),
    actionOnSuccess: (data) => statsLoaded([taskId!, data]),
    loader: () => apiClient.rpc(getStats, { orgId, taskId }),
  });

  return {
    data: taskStatsFuture.data,
    isLoading: taskStatsFuture.isLoading,
  };
}
