import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLocation as ZetkinEventLocation } from 'utils/types/zetkin';
import { locationsLoad, locationsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import loadEventLocations from '../rpc/loadEventLocations';

export default function useEventLocations(
  orgId: number
): ZetkinEventLocation[] | null {
  const apiClient = useApiClient();
  const locationsList = useAppSelector((state) => state.events.locationList);
  const dispatch = useAppDispatch();

  const locations = loadListIfNecessary(locationsList, dispatch, {
    actionOnLoad: () => locationsLoad(),
    actionOnSuccess: (data) => locationsLoaded(data),
    loader: () => apiClient.rpc(loadEventLocations, { orgId }),
  });

  return locations.data;
}
