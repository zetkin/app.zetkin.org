import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteListFuture from 'core/hooks/useRemoteListFuture';
import { IFuture, ResolvedFuture } from 'core/caching/futures';
import { userAssignmentsLoad, userAssignmentsLoaded } from '../store';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

export default function useMyCallAssignments(): IFuture<
  ZetkinCallAssignment[]
> {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.callAssignments.userAssignmentList
  );

  const future = useRemoteListFuture(list, {
    actionOnLoad: () => userAssignmentsLoad(),
    actionOnSuccess: (data) => userAssignmentsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinCallAssignment[]>(`/api/users/me/call_assignments`),
  });

  if (!future.data) {
    return future;
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return new ResolvedFuture(
    future.data.filter(
      ({ end_date, start_date }) =>
        start_date &&
        start_date <= today &&
        (end_date == null || end_date >= today)
    )
  );
}
