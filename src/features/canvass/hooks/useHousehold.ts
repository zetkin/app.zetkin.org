import { Zetkin2Household } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { householdLoad, householdLoaded } from '../store';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useHousehold(
  orgId: number,
  locationId: number,
  householdId: number
): Zetkin2Household {
  const apiClient = useApiClient();
  const item = useAppSelector((state) =>
    state.canvass.householdsByLocationId[locationId].items.find(
      (item) => item.id == householdId
    )
  );

  return useRemoteItem(item, {
    actionOnLoad: () => householdLoad([locationId, householdId]),
    actionOnSuccess: (data) => householdLoaded([locationId, data]),
    loader: () =>
      apiClient.get<Zetkin2Household>(
        `/api2/orgs/${orgId}/locations/${locationId}/households/${householdId}`
      ),
  });
}
