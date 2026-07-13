import { useApiClient, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';

export default function useMyAreaAssignments() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.canvass.myAssignmentsList);

  const assignments = useRemoteList(list, {
    actionOnLoad: () => myAssignmentsLoad(),
    actionOnSuccess: (data) => myAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinAreaAssignment[]>('/api2/users/me/area_assignments'),
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
