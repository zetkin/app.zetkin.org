import { useApiClient, useAppDispatch } from 'core/hooks';
import { Zetkin2Area, Zetkin2AreaPostBody } from '../types';
import { areaDeleted, areaUpdated } from '../store';

export default function useAreaMutations(orgId: number, areaId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async deleteArea() {
      await apiClient.delete(`/api2/orgs/${orgId}/areas/${areaId}`);
      dispatch(areaDeleted(areaId));
    },
    async updateArea(data: Zetkin2AreaPostBody) {
      const area = await apiClient.patch<Zetkin2Area, Zetkin2AreaPostBody>(
        `/api2/orgs/${orgId}/areas/${areaId}`,
        data
      );

      dispatch(areaUpdated(area));
    },
  };
}
