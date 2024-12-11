import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { userAssignmentsLoad, userAssignmentsLoaded } from '../store';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function useMyCallAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.callAssignments.userAssignmentList
  );

  return useRemoteList(list, {
    actionOnLoad: () => userAssignmentsLoad(),
    actionOnSuccess: (data) => userAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCallAssignment[]>(`/api/users/me/call_assignments`),
  });
}
