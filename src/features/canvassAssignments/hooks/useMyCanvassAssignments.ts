import { useApiClient, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import { AssignmentWithAreas } from '../types';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useMyCanvassAssignments() {
  const apiClient = useApiClient();
  const assignments = useAppSelector(
    (state) => state.canvassAssignments.myAssignmentsWithAreasList
  );

  return useRemoteList(assignments, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<AssignmentWithAreas[]>('/beta/users/me/canvassassignments'),
  });
}
