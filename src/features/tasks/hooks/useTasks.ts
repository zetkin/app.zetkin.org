import { useSelector } from 'react-redux';

import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { RootState } from 'core/store';
import { ZetkinTask } from '../components/types';
import { tasksLoad, tasksLoaded } from '../store';
import { useApiClient, useEnv } from 'core/hooks';

interface UseTasksReturn {
  tasksFuture: IFuture<ZetkinTask[]>;
}

export default function useTasks(orgId: number): UseTasksReturn {
  const taskList = useSelector((state: RootState) => state.tasks.tasksList);
  const env = useEnv();
  const apiClient = useApiClient();

  const tasksFuture = loadListIfNecessary(taskList, env.store, {
    actionOnLoad: () => tasksLoad(),
    actionOnSuccess: (data) => tasksLoaded(data),
    loader: () => apiClient.get<ZetkinTask[]>(`/api/orgs/${orgId}/tasks/`),
  });

  return {
    tasksFuture,
  };
}
