import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinLocation as ZetkinEventLocation } from 'utils/types/zetkin';
import { locationsLoad, locationsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
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
      const locations: ZetkinEventLocation[] = await apiClient
        .get<ZetkinLocation[]>(`/api2/orgs/${orgId}/locations`)
        .then((locations) =>
          locations
            .filter(excludeLocationsCreatedWhileCanvassing)
            .map((location) => ({
              id: location.id,
              info_text: location.description,
              lat: location.latitude,
              lng: location.longitude,
              title: location.title,
            }))
        );

      return locations;
    },
  });

  return locations.data;
}

function excludeLocationsCreatedWhileCanvassing(
  location: ZetkinLocation
): boolean {
  const hasUserInfo = location.created_by_user_id;
  const createdWithApiV1 = !hasUserInfo;
  return createdWithApiV1;
}
