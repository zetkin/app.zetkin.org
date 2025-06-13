import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinArea, ZetkinAreaPostBody } from '../types';
import { areaCreated } from '../store';
import {
  displayToBackendArray,
  backendToDisplayArray,
} from '../utils/coordinateConversion';

export default function useCreateArea(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createArea(
    data: ZetkinAreaPostBody
  ): Promise<ZetkinArea> {
    // Convert coordinates from display format [lat, lng] to backend format [lng, lat]
    const backendData = {
      ...data,
      boundary: data.boundary
        ? {
            ...data.boundary,
            coordinates: data.boundary.coordinates.map((polygon) =>
              displayToBackendArray(polygon)
            ),
          }
        : undefined,
    };

    const created = await apiClient.post<ZetkinArea, ZetkinAreaPostBody>(
      `/api2/orgs/${orgId}/areas`,
      backendData
    );

    // Convert response coordinates back to display format and store
    const areaWithDisplayCoords = {
      ...created,
      boundary: {
        ...created.boundary,
        coordinates: created.boundary.coordinates.map((polygon) =>
          backendToDisplayArray(polygon)
        ),
      },
      tags: created.tags || [],
    };

    dispatch(areaCreated(areaWithDisplayCoords));

    return areaWithDisplayCoords;
  };
}
