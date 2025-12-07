import { ZetkinTask } from '../components/types';
import { taskLoad, taskLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useTask(
  orgId: number,
  taskId: number
): ZetkinTask | null {
  const apiClient = useApiClient();
  const tasks = useAppSelector((state) => state.tasks);

  const item = tasks.tasksList.items.find((item) => item.id === taskId);

  const task = useRemoteItem(item, {
    actionOnLoad: () => taskLoad(taskId),
    actionOnSuccess: (data) => taskLoaded(data),
    cacheKey: `task-${orgId}-${taskId}`,
    loader: () =>
      apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}`),
  });
  return task;
}
