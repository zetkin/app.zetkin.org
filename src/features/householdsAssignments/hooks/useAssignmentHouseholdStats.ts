import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { householdStatsLoad, householdStatsLoaded } from '../store';
import { ZetkinAssignmentHouseholdStats } from '../types';

export default function useAssignmentHouseholdStats(
  orgId: number,
  householdAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.householdAssignments.householdStatsByAssignmentId[householdAssId]
  );

  return loadItemIfNecessary(stats, dispatch, {
    actionOnLoad: () => householdStatsLoad(householdAssId),
    actionOnSuccess: (data) => householdStatsLoaded([householdAssId, data]),
    loader: () =>
      apiClient.get<ZetkinAssignmentHouseholdStats>(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/householdstats`
      ),
  });
}
