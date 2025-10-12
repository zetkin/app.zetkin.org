import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinHouseholdAssignmentStats } from '../types';
import { statsLoad, statsLoaded } from '../store';

export default function useHouseholdAssignmentStats(
  orgId: number,
  householdAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.householdAssignments.statsByHouseholdAssId[householdAssId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(householdAssId),
    actionOnSuccess: (data) => statsLoaded([householdAssId, data]),
    loader: () =>
      apiClient.get<ZetkinHouseholdAssignmentStats>(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/stats`
      ),
  });
}
