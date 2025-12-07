import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function useMyAssignments() {
  const apiClient = useApiClient();
  const myAssignmnentsList = useAppSelector(
    (state) => state.call.myAssignmentsList
  );

  return useRemoteList(myAssignmnentsList, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    cacheKey: 'my-call-assignments',
    loader: () =>
      apiClient.get<ZetkinCallAssignment[]>('/api/users/me/call_assignments'),
  });
}
