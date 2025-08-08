import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLocation as ZetkinEventLocation } from 'utils/types/zetkin';
import { locationsLoad, locationsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';
import { ZetkinLocation } from 'features/areaAssignments/types';

export default function useEventLocations(
  orgId: number
): ZetkinEventLocation[] | null {
  const apiClient = useApiClient();
  const locationsList = useAppSelector((state) => state.events.locationList);
  const dispatch = useAppDispatch();

  const locations = loadListIfNecessary(locationsList, dispatch, {
    actionOnLoad: () => locationsLoad(),
    actionOnSuccess: (data) => locationsLoaded(data),
    loader: async () => {
      const locations = await fetchAllPaginated<ZetkinLocation>((page) =>
        apiClient.get(
          `/api2/orgs/${orgId}/locations?size=100&page=${page}&type=event`
        )
      );

      return locations.map((location) => ({
        id: location.id,
        info_text: location.description,
        lat: location.latitude,
        lng: location.longitude,
        title: location.title,
      }));
    },
  });

  return locations.data;
}
