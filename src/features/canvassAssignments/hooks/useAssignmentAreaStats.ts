import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areaStatsLoad, areaStatsLoaded } from '../store';
import { ZetkinAssignmentAreaStats } from '../types';

export default function useAssignmentAreaStats(
  orgId: number,
  canvassAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.canvassAssignments.areaStatsByAssignmentId[canvassAssId]
  );

  return loadItemIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaStatsLoad(canvassAssId),
    actionOnSuccess: (data) => areaStatsLoaded([canvassAssId, data]),
    loader: () =>
      apiClient.get<ZetkinAssignmentAreaStats>(
        `/beta/orgs/${orgId}/canvassassignments/${canvassAssId}/areastats`
      ),
  });
}
