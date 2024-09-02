import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinArea, ZetkinAreaPostBody } from '../types';
import { areaCreated } from '../store';

export default function useCreateArea(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createArea(data: ZetkinAreaPostBody) {
    const created = await apiClient.post<ZetkinArea, ZetkinAreaPostBody>(
      `/beta/orgs/${orgId}/areas`,
      data
    );
    dispatch(areaCreated(created));
  };
}
