import { PromiseFuture, ResolvedFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinTask, ZetkinTaskRequestBody } from '../components/types';

export default function useCreateTask(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks);

  const createTask = async (
    body: ZetkinTaskRequestBody
  ): Promise<ZetkinTask> => {
    //dispatch blah
    const taskFuture = await apiClient
      .post<ZetkinTask, ZetkinTaskRequestBody>(`/api/orgs/${orgId}/tasks`, body)
      .then((data: ZetkinTask) => {
        // dispatch(tagGroupCreated);
        return data;
      });
    return taskFuture;
  };
  //   const createTagGroup = async (newGroup: NewTag) => {
  //     dispatch(tagGroupCreate);
  //     const tagGroupFuture = await apiClient
  //       .post<ZetkinTask, ZetkinTaskRequestBody>(
  //         `/api/orgs/${orgId}/tasks`,
  //         newGroup
  //       )
  //       .then((data: ZetkinTagGroup) => {
  //         dispatch(tagGroupCreated);
  //         return data;
  //       });
  //     return tagGroupFuture;
  //   };
  return createTask;
}
