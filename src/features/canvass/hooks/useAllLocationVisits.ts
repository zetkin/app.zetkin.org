import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { visitsError, visitsLoad, visitsLoaded } from '../store';
import { serializeError } from 'utils/storeUtils/serializeError';

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
    actionOnError: (err) => visitsError([assignmentId, serializeError(err)]),
    actionOnLoad: () => visitsLoad(assignmentId),
    actionOnSuccess: (items) => visitsLoaded([assignmentId, items]),
    loader: () =>
      apiClient.get(
        `/beta/orgs/${orgId}/areaassignments/${assignmentId}/visits`
      ),
  });
}
