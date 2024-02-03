import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import getStats, { TaskStats } from '../rpc/getTaskStats';
import { statsLoad, statsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseTaskStatsReturn {
  data: TaskStats | null;
  isLoading: boolean;
}

export default function useTaskStats(
  orgId: number,
  taskId: number
): UseTaskStatsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);

  const item = tasks.statsById[taskId!];

  const taskStatsFuture = loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => statsLoad(taskId!),
    actionOnSuccess: (data) => statsLoaded([taskId!, data]),
    loader: () => apiClient.rpc(getStats, { orgId, taskId }),
  });

  return {
    data: taskStatsFuture.data,
    isLoading: taskStatsFuture.isLoading,
  };
}
