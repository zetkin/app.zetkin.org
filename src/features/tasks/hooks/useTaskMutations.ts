import { taskDeleted } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
interface UseTaskReturn {
  deleteTask: () => Promise<void>;
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

  return {
    deleteTask,
  };
}
