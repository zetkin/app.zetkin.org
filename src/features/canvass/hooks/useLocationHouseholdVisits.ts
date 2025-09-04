import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { householdVisitsLoad, householdVisitsLoaded } from '../store';
import loadLocationHouseholdVisits from '../rpc/loadLocationHouseholdVisits';

export default function useLocationHouseholdVisits(
  orgId: number,
  assignmentId: number,
  locationId: number
) {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) =>
      state.canvass.visitsByAssignmentAndLocationId[assignmentId]?.[locationId]
  );

  return useRemoteList(list, {
    actionOnLoad: () => householdVisitsLoad([assignmentId, locationId]),
    actionOnSuccess: (data) =>
      householdVisitsLoaded([assignmentId, locationId, data]),
    cacheKey: `loadLocationHouseholdVisits-${assignmentId}-${locationId}`,
    loader: async () => {
      const result = await apiClient.rpc(loadLocationHouseholdVisits, {
        assignmentId,
        locationId,
        orgId,
      });

      return result.visits;
    },
  });
}
