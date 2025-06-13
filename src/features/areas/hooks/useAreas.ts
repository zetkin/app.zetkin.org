import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { areasLoad, areasLoaded } from '../store';
import { ZetkinArea } from '../types';
import { backendToDisplayArray } from '../utils/coordinateConversion';

export default function useAreas(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.areas.areaList);

  const areasResult = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => areasLoad(),
    actionOnSuccess: (data) => areasLoaded(data),
    loader: () =>
      apiClient.get<ZetkinArea[]>(`/api2/orgs/${orgId}/areas`).then((areas) =>
        areas.map<ZetkinArea>((area) => ({
          ...area,
          // Convert coordinates from backend format [lng, lat] to display format [lat, lng]
          boundary: {
            ...area.boundary,
            coordinates: area.boundary.coordinates.map((polygon) =>
              backendToDisplayArray(polygon)
            ),
          },
          tags: area.tags || [],
        }))
      ),
  });

  return areasResult;
}
