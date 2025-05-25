import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { visitsLoad, visitsLoaded } from '../store';

export default function useAllLocationVisits(
  orgId: number,
  assignmentId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const visitList = useAppSelector(
    (state) => state.canvass.visitsByAssignmentId[assignmentId]
  );

  return loadListIfNecessary(visitList, dispatch, {
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/areaassignments/${assignmentId}/visits`
      ),
  });
}
