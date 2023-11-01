import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinTask } from '../components/types';
import { tasksLoad, tasksLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useTasks(orgId: number): IFuture<ZetkinTask[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const taskList = useAppSelector((state) => state.tasks.tasksList);

  return loadListIfNecessary(taskList, dispatch, {
    actionOnLoad: () => tasksLoad(),
    actionOnSuccess: (data) => tasksLoaded(data),
    loader: () => apiClient.get<ZetkinTask[]>(`/api/orgs/${orgId}/tasks/`),
  });
}
