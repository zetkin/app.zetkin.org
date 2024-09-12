import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import { ZetkinIndividualCanvassAssignment } from '../types';

export default function useMyCanvassAssignments() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const myAssignments = useAppSelector(
    (state) => state.areas.myAssignmentsList
  );

  return loadListIfNecessary(myAssignments, dispatch, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinIndividualCanvassAssignment[]>(
        '/beta/users/me/canvassassignments'
      ),
  });
}
