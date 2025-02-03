import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { visitsLoad, visitsLoaded } from '../store';
import { ResolvedFuture } from 'core/caching/futures';

export default function useLocationVisits(
  orgId: number,
  assignmentId: string,
  locationId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitList = useAppSelector(
    (state) => state.canvass.visitsByAssignmentId[assignmentId]
  );

  const future = loadListIfNecessary(visitList, dispatch, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/areaassignments/${assignmentId}/visits`
      ),
  });

  if (future.data) {
    return new ResolvedFuture(
      future.data.filter((visit) => visit.locationId == locationId)
    );
  }

  return future;
}
