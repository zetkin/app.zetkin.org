import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinArea, ZetkinAreaPostBody } from '../types';
import { areaDeleted, areaUpdated } from '../store';

export default function useAreaMutations(orgId: number, areaId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async deleteArea() {
      await apiClient.delete(`/beta/orgs/${orgId}/areas/${areaId}`);
      dispatch(areaDeleted(areaId));
    },
    async updateArea(data: ZetkinAreaPostBody) {
      const area = await apiClient.patch<ZetkinArea, ZetkinAreaPostBody>(
        `/beta/orgs/${orgId}/areas/${areaId}`,
        data
      );
      dispatch(areaUpdated(area));
    },
  };
}
