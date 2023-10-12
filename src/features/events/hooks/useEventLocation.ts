import { futureToObject, IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLocation } from 'utils/types/zetkin';
import { locationsLoad, locationsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventLocation(
  orgId: number
): ZetkinLocation[] | null {
  const apiClient = useApiClient();
  const locationsList = useAppSelector((state) => state.events.locationList);
  const dispatch = useAppDispatch();

  const locations = loadListIfNecessary(locationsList, dispatch, {
    actionOnLoad: () => locationsLoad(),
    actionOnSuccess: (data) => locationsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinLocation[]>(`/api/orgs/${orgId}/locations`),
  });

  return locations.data;
}
