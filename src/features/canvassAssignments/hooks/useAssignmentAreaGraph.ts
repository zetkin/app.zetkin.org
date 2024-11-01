import { AreaCardData } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { areaGraphLoad, areaGraphLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignmentAreaStats(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.canvassAssignments.areaGraphByAssignmentId[canvassAssId]
  );

  return loadListIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaGraphLoad(canvassAssId),
    actionOnSuccess: (data) => areaGraphLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<AreaCardData[]>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/areasgraph`
      ),
  });
}
