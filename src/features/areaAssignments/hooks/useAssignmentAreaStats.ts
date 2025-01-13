import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areaStatsLoad, areaStatsLoaded } from '../store';
import { ZetkinAssignmentAreaStats } from '../types';

export default function useAssignmentAreaStats(
  orgId: number,
  areaAssId: string
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.areaAssignments.areaStatsByAssignmentId[areaAssId]
  );

  return loadItemIfNecessary(stats, dispatch, {
    actionOnLoad: () => areaStatsLoad(areaAssId),
    actionOnSuccess: (data) => areaStatsLoaded([areaAssId, data]),
    loader: () =>
      apiClient.get<ZetkinAssignmentAreaStats>(
        `/beta/orgs/${orgId}/areaassignments/${areaAssId}/areastats`
      ),
  });
}
