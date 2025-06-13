import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinArea, ZetkinAreaPostBody } from '../types';
import { areaDeleted, areaUpdated } from '../store';
import {
  displayToBackendArray,
  backendToDisplayArray,
} from '../utils/coordinateConversion';

export default function useAreaMutations(orgId: number, areaId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async deleteArea() {
      await apiClient.delete(`/api2/orgs/${orgId}/areas/${areaId}`);
      dispatch(areaDeleted(areaId));
    },
    async updateArea(data: ZetkinAreaPostBody) {
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

      const area = await apiClient.patch<ZetkinArea, ZetkinAreaPostBody>(
        `/api2/orgs/${orgId}/areas/${areaId}`,
        backendData
      );

      // Convert response coordinates back to display format and store
      const areaWithDisplayCoords = {
        ...area,
        boundary: {
          ...area.boundary,
          coordinates: area.boundary.coordinates.map((polygon) =>
            backendToDisplayArray(polygon)
          ),
        },
        tags: area.tags || [],
      };

      dispatch(areaUpdated(areaWithDisplayCoords));
    },
  };
}
