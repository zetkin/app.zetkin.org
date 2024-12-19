import { useApiClient, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import { AssignmentWithAreas } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useMyCanvassAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.canvassAssignments.myAssignmentsWithAreasList
  );

  const assignments = useRemoteList(list, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<AssignmentWithAreas[]>('/beta/users/me/canvassassignments'),
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
