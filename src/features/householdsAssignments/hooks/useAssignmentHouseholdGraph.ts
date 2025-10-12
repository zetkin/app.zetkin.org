import { HouseholdCardData } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { householdGraphLoad, householdGraphLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAssignmentHouseholdStats(
  orgId: number,
  householdAssId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const stats = useAppSelector(
    (state) => state.householdAssignments.householdGraphByAssignmentId[householdAssId]
  );

  return loadListIfNecessary(stats, dispatch, {
    actionOnLoad: () => householdGraphLoad(householdAssId),
    actionOnSuccess: (data) => householdGraphLoaded([householdAssId, data]),
    loader: () =>
      apiClient.get<HouseholdCardData[]>(
        `/beta/orgs/${orgId}/householdsassignments/${householdAssId}/householdgraph`
      ),
  });
}
