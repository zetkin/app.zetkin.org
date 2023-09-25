import { useSelector } from 'react-redux';

import { RootState } from 'core/store';
import { ZetkinTask } from '../components/types';
import getStats, { TaskStats } from '../rpc/getTaskStats';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import {
  statsLoad,
  statsLoaded,
  taskLoad,
  taskLoaded,
  tasksLoad,
  tasksLoaded,
} from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseTaskReturn {
  taskData: ZetkinTask | null;
  tasksData: ZetkinTask[] | null;
  tasksDataLoading: boolean;
  taskStats: TaskStats | null;
  taskStatsIsLoading: boolean;
}

export default function useTask(orgId: number, taskId?: number): UseTaskReturn {
  const apiClient = useApiClient();
  const env = useEnv();

  const tasks = useSelector((state: RootState) => state.tasks);

  const getTask = (taskId: number) => {
    const item = tasks.tasksList.items.find((item) => item.id === taskId);

    return loadItemIfNecessary(item, env.store, {
      actionOnLoad: () => taskLoad(taskId),
      actionOnSuccess: (data) => taskLoaded(data),
      loader: () =>
        apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}`),
    });
  };

  const getTasks = () => {
    const taskList = tasks.tasksList;
    return loadListIfNecessary(taskList, env.store, {
      actionOnLoad: () => tasksLoad(),
      actionOnSuccess: (data) => tasksLoaded(data),
      loader: () => apiClient.get<ZetkinTask[]>(`/api/orgs/${orgId}/tasks/`),
    });
  };

  const getTaskStats = (taskId: number) => {
    const item = tasks.statsById[taskId!];
    return loadItemIfNecessary(item, env.store, {
      actionOnLoad: () => statsLoad(taskId!),
      actionOnSuccess: (data) => statsLoaded([taskId!, data]),
      loader: () => apiClient.rpc(getStats, { orgId, taskId }),
    });
  };

  return {
    taskData: getTask(taskId!).data,
    taskStats: getTaskStats(taskId!).data,
    taskStatsIsLoading: getTaskStats(taskId!).isLoading,
    tasksData: getTasks().data,
    tasksDataLoading: getTasks().isLoading,
  };
}
