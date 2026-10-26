import { HouseholdWithColor } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { householdError, householdLoad, householdLoaded } from '../store';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { serializeError } from 'utils/storeUtils/serializeError';

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
    actionOnError: (err) =>
      householdError([locationId, householdId, serializeError(err)]),
    actionOnLoad: () => householdLoad([locationId, householdId]),
    actionOnSuccess: (data) => householdLoaded([locationId, data]),
    loader: () =>
      apiClient.get<HouseholdWithColor>(
        `/beta/orgs/${orgId}/locations/${locationId}/households/${householdId}`
      ),
  });
}
