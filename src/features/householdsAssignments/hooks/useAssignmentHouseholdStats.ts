import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { householdStatsLoad, householdStatsLoaded } from '../store';
import { ZetkinAssignmentHouseholdStats } from '../types';

export default function useAssignmentHouseholdStats(
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) =>
      state.householdAssignments.householdStatsByAssignmentId[householdsAssId]
  );

  return loadItemIfNecessary(stats, dispatch, {
    actionOnLoad: () => householdStatsLoad(householdsAssId),
    actionOnSuccess: (data) => householdStatsLoaded([householdsAssId, data]),
    loader: () =>
      apiClient.get<ZetkinAssignmentHouseholdStats>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/householdstats`
      ),
  });
}
