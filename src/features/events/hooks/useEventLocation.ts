import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLocation } from 'utils/types/zetkin';
import { locationLoad, locationLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventLocation(
  orgId: number,
  locationId: number
): ZetkinLocation | null {
  const apiClient = useApiClient();
  const locationItem = useAppSelector((state) =>
    state.events.locationList.items.find((item) => item.id == locationId)
  );
  const dispatch = useAppDispatch();

  const future = loadItemIfNecessary(locationItem, dispatch, {
    actionOnLoad: () => locationLoad(locationId),
    actionOnSuccess: (data) => locationLoaded(data),
    loader: () =>
      apiClient.get<ZetkinLocation>(
        `/api/orgs/${orgId}/locations/${locationId}`
      ),
  });

  return future.data;
}
