import { HouseholdWithColor } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { householdLoad, householdLoaded } from '../store';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useHousehold(
  orgId: number,
  locationId: number,
  householdId: number
): HouseholdWithColor {
  const apiClient = useApiClient();
  const item = useAppSelector((state) =>
    state.canvass.householdsByLocationId[locationId].items.find(
      (item) => item.id == householdId
    )
  );

  return useRemoteItem(item, {
    actionOnLoad: () => householdLoad([locationId, householdId]),
    actionOnSuccess: (data) => householdLoaded([locationId, data]),
    cacheKey: `household-${orgId}-${locationId}-${householdId}`,
    loader: () =>
      apiClient.get<HouseholdWithColor>(
        `/beta/orgs/${orgId}/locations/${locationId}/households/${householdId}`
      ),
  });
}
