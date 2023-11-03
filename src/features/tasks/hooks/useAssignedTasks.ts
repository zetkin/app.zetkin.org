import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinAssignedTask } from '../components/types';
import { assignedTasksLoad, assignedTasksLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignedTasks(orgId: number, taskId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);
  const list = tasks.assignedTasksByTaskId[taskId];

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => assignedTasksLoad(taskId),
    actionOnSuccess: (data) => assignedTasksLoaded([taskId, data]),
    loader: () =>
      apiClient.get<ZetkinAssignedTask[]>(
        `/api/orgs/${orgId}/tasks/${taskId}/assigned`
      ),
  });
}
