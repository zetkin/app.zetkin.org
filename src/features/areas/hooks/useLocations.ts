import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinLocation } from '../types';
import { locationsLoad, locationsLoaded } from '../store';
import { loadListIfNecessary } from 'core/caching/cacheUtils';

export default function useLocations(
  orgId: number,
  areaId: number | null
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const key = `${areaId}`;
  const locationList = useAppSelector(
    (state) => state.areas.locationsByAreaId[key]
  );

  let locations = [];

  if(areaId)  {

    locations = loadListIfNecessary(locationList, dispatch, {
      actionOnLoad: () => locationsLoad(key),
      actionOnSuccess: (data) => locationsLoaded([key, data]),
      loader: () =>
        apiClient.get<ZetkinLocation[]>(
          `/api2/orgs/${orgId}/locations?within_areas=${areaId}`
        ),
      }).data;
    }
  return locations;
}
