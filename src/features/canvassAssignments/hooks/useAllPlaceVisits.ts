import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { visitsLoad, visitsLoaded } from '../store';

export default function useAllPlaceVisits(orgId: number, assignmentId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitList = useAppSelector(
    (state) => state.canvassAssignments.visitsByAssignmentId[assignmentId]
  );

  return loadListIfNecessary(visitList, dispatch, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/canvassassignments/${assignmentId}/visits`
      ),
  });
}
