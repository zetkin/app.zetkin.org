import { useApiClient, useAppSelector } from 'core/hooks';
import { myAssignmentsLoad, myAssignmentsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import useRemoteListFuture from 'core/hooks/useRemoteListFuture';
import { IFuture, ResolvedFuture } from 'core/caching/futures';
import { ZetkinAreaAssignment } from 'features/areaAssignments/types';

function useListWithHooks() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.canvass.myAssignmentsList);

  return {
    hooks: {
      actionOnLoad: () => myAssignmentsLoad(),
      actionOnSuccess: (data: ZetkinAreaAssignment[]) =>
        myAssignmentsLoaded(data),
      loader: () =>
        apiClient.get<ZetkinAreaAssignment[]>(
          '/api2/users/me/area_assignments'
        ),
    },
    list,
  };
}

function filterActive(assignments: ZetkinAreaAssignment[]) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return assignments.filter(
    ({ end_date, start_date }) =>
      start_date &&
      start_date.slice(0, 10) <= today &&
      (end_date == null || end_date.slice(0, 10) >= today)
  );
}

export default function useMyAreaAssignments() {
  const { hooks, list } = useListWithHooks();
  return filterActive(useRemoteList(list, hooks));
}

export function useMyAreaAssignmentsFuture(): IFuture<ZetkinAreaAssignment[]> {
  const { hooks, list } = useListWithHooks();
  const future = useRemoteListFuture(list, hooks);

  if (!future.data) {
    return future;
  }

  return new ResolvedFuture(filterActive(future.data));
}
