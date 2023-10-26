import { taskDeleted, taskUpdate, taskUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTask, ZetkinTaskRequestBody } from '../components/types';
interface UseTaskReturn {
  deleteTask: () => Promise<void>;
  updateTask: (body: ZetkinTask) => Promise<ZetkinTask>;
}

export default function useTaskMutations(
  orgId: number,
  taskId: number
): UseTaskReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteTask = async () => {
    await apiClient.delete(`/api/orgs/${orgId}/tasks/${taskId}`);
    dispatch(taskDeleted(taskId));
  };

  const updateTask = async (body: ZetkinTask) => {
    dispatch(taskUpdate([taskId, Object.keys(body)]));
    const taskFuture = await apiClient
      .patch<ZetkinTask, ZetkinTaskRequestBody>(
        `/api/orgs/${orgId}/tasks/${taskId}`,
        body
      )
      .then((data: ZetkinTask) => {
        dispatch(taskUpdated(data));
        return data;
      });
    return taskFuture;
  };

  return {
    deleteTask,
    updateTask,
  };
}
