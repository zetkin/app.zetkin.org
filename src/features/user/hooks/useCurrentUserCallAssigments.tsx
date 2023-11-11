import { CallAssignmentData } from '../../callAssignments/apiTypes';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  callAssignmentsLoad,
  callAssignmentsLoaded,
} from '../../callAssignments/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCurrentUserCallAssignments(): IFuture<
  CallAssignmentData[]
> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const assignmentList = useAppSelector(
    (state) => state.callAssignments.assignmentList
  );

  return loadListIfNecessary(assignmentList, dispatch, {
    actionOnLoad: () => callAssignmentsLoad(),
    actionOnSuccess: (data) => callAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<CallAssignmentData[]>(`/api/users/me/call_assignments`),
  });
}
