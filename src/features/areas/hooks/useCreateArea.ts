import { useApiClient, useAppDispatch } from 'core/hooks';
import { Zetkin2Area, Zetkin2AreaPostBody } from '../types';
import { areaCreated } from '../store';

export default function useCreateArea(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createArea(
    data: Zetkin2AreaPostBody
  ): Promise<Zetkin2Area> {
    const created = await apiClient.post<Zetkin2Area, Zetkin2AreaPostBody>(
      `/api2/orgs/${orgId}/areas`,
      data
    );

    dispatch(areaCreated(created));

    return created;
  };
}
