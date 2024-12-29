import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinLocation } from '../types';
import { locationsLoad, locationsLoaded } from '../store';

export default function useLocations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const locationList = useAppSelector(
    (state) => state.areaAssignments.locationList
  );

  return loadListIfNecessary(locationList, dispatch, {
    actionOnLoad: () => locationsLoad(),
    actionOnSuccess: (data) => locationsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinLocation[]>(`/beta/orgs/${orgId}/locations`),
  });
}
