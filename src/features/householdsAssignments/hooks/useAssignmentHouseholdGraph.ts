import { HouseholdCardData } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { householdGraphLoad, householdGraphLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignmentHouseholdStats(
  campId: number,
  orgId: number,
  householdsAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) =>
      state.householdAssignments.householdGraphByAssignmentId[householdsAssId]
  );

  return loadListIfNecessary(stats, dispatch, {
    actionOnLoad: () => householdGraphLoad(householdsAssId),
    actionOnSuccess: (data) => householdGraphLoaded([householdsAssId, data]),
    loader: () =>
      apiClient.get<HouseholdCardData[]>(
        `/beta/orgs/${orgId}/projects/${campId}/householdsassignment/${householdsAssId}/householdgraph`
      ),
  });
}
