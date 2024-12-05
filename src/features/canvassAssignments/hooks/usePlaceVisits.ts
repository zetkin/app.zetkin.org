import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { visitsLoad, visitsLoaded } from '../store';
import { ResolvedFuture } from 'core/caching/futures';

export default function usePlaceVisits(
  orgId: number,
  assignmentId: string,
  placeId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitList = useAppSelector(
    (state) => state.canvassAssignments.visitsByAssignmentId[assignmentId]
  );

  const future = loadListIfNecessary(visitList, dispatch, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/canvassassignments/${assignmentId}/visits`
      ),
  });

  if (future.data) {
    return new ResolvedFuture(
      future.data.filter((visit) => visit.placeId == placeId)
    );
  }

  return future;
}
