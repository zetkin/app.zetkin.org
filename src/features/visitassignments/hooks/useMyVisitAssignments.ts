import { useApiClient, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinVisitAssignment } from 'features/visitassignments/types';

export default function useMyVisitAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.visitAssignments.myAssignmentsList
  );

  const assignments = useRemoteList(list, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinVisitAssignment[]>('/beta/users/me/visitassignments'),
  });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return assignments.filter(
    ({ end_date, start_date }) =>
      start_date &&
      start_date.slice(0, 10) <= today &&
      (end_date == null || end_date.slice(0, 10) >= today)
  );
}
