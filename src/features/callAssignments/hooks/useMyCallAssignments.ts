import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { userAssignmentsLoad, userAssignmentsLoaded } from '../store';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function useMyCallAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.callAssignments.userAssignmentList
  );

  const assignments = useRemoteList(list, {
    actionOnLoad: () => userAssignmentsLoad(),
    actionOnSuccess: (data) => userAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCallAssignment[]>(`/api/users/me/call_assignments`),
  });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return assignments.filter(
    ({ end_date, start_date }) =>
      start_date &&
      start_date <= today &&
      (end_date == null || end_date >= today)
  );
}
