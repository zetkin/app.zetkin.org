import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinPlace } from '../types';
import { placesLoad, placesLoaded } from '../store';

export default function usePlaces(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const placeList = useAppSelector((state) => state.areaAssignments.placeList);

  return loadListIfNecessary(placeList, dispatch, {
    actionOnLoad: () => placesLoad(),
    actionOnSuccess: (data) => placesLoaded(data),
    loader: () => apiClient.get<ZetkinPlace[]>(`/beta/orgs/${orgId}/places`),
  });
}
