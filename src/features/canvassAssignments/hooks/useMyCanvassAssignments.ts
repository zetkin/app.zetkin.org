import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import { AssignmentWithAreas } from '../types';

export default function useMyCanvassAssignments() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const mySessions = useAppSelector(
    (state) => state.canvassAssignments.myAssignmentsWithAreasList
  );

  return loadListIfNecessary(mySessions, dispatch, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<AssignmentWithAreas[]>('/beta/users/me/canvassassignments'),
  });
}
