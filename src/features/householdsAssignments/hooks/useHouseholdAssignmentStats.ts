import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinHouseholdAssignmentStats } from '../types';
import { statsLoad, statsLoaded } from '../store';

export default function useHouseholdAssignmentStats(
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) =>
      state.householdAssignments.statsByHouseholdsAssId[householdsAssId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => statsLoad(householdsAssId),
    actionOnSuccess: (data) => statsLoaded([householdsAssId, data]),
    loader: () =>
      apiClient.get<ZetkinHouseholdAssignmentStats>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/stats`
      ),
  });
}
