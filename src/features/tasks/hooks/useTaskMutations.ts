import { ZetkinQuery } from 'utils/types/zetkin';
import { taskDeleted, taskUpdate, taskUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTask, ZetkinTaskRequestBody } from '../components/types';

type ZetkinQueryPatchBody = Omit<ZetkinQuery, 'id'>;

interface UseTaskReturn {
  deleteTask: () => Promise<void>;
  updateTargetQuery: (body: ZetkinQueryPatchBody) => Promise<ZetkinQuery>;
  updateTask: (body: ZetkinTaskRequestBody) => Promise<ZetkinTask>;
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

  const updateTask = async (body: ZetkinTaskRequestBody) => {
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

  const updateTargetQuery = async (body: ZetkinQueryPatchBody) => {
    const task = await apiClient.get<ZetkinTask>(
      `/api/orgs/${orgId}/tasks/${taskId}`
    );
    const queryId = task.target.id;
    const query = await apiClient.patch<ZetkinQuery, ZetkinQueryPatchBody>(
      `/api/orgs/${orgId}/people/queries/${queryId}`,
      body
    );

    dispatch(
      taskUpdated({
        ...task,
        target: query,
      })
    );

    return query;
  };

  return {
    deleteTask,
    updateTargetQuery,
    updateTask,
  };
}
