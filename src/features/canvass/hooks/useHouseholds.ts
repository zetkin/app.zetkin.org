import useRemoteList from 'core/hooks/useRemoteList';
import { HouseholdWithColor } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { householdsLoad, householdsLoaded } from '../store';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useHouseholds(
  orgId: number,
  locationId: number
): HouseholdWithColor[] {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.canvass.householdsByLocationId[locationId]
  );
  return useRemoteList(list, {
    actionOnLoad: () => householdsLoad(locationId),
    actionOnSuccess: (data) => householdsLoaded([locationId, data]),
    cacheKey: `households-${orgId}-${locationId}`,
    loader: async () =>
      fetchAllPaginated<HouseholdWithColor>(
        (page) =>
          apiClient.get(
            `/beta/orgs/${orgId}/locations/${locationId}/households?size=100&page=${page}`
          ),
        100
      ),
  });
}
