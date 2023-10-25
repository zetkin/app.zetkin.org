import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignedTask(orgId: number, taskId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  // const taskFuture = loadItemIfNecessary(item, dispatch, {
  //   actionOnLoad: () => taskLoad(taskId),
  //   actionOnSuccess: (data) => taskLoaded(data),
  //   loader: () =>
  //     apiClient.get<ZetkinTask>(`/api/orgs/${orgId}/tasks/${taskId}/assigned`),
  // });
}
