import { taskCreate, taskCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTask, ZetkinTaskRequestBody } from '../components/types';

export default function useCreateTask(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createTask = async (
    body: ZetkinTaskRequestBody
  ): Promise<ZetkinTask> => {
    dispatch(taskCreate());
    const taskFuture = await apiClient
      .post<ZetkinTask, ZetkinTaskRequestBody>(`/api/orgs/${orgId}/tasks`, body)
      .then((data: ZetkinTask) => {
        dispatch(taskCreated(data));
        return data;
      });
    return taskFuture;
  };
  return createTask;
}
