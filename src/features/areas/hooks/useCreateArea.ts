import { useApiClient, useAppDispatch } from 'core/hooks';
import { Zetkin2Area, Zetkin2AreaPostBody, ZetkinArea } from '../types';
import { areaCreated } from '../store';

export default function useCreateArea(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createArea(
    data: Zetkin2AreaPostBody
  ): Promise<ZetkinArea> {
    const created = await apiClient.post<Zetkin2Area, Zetkin2AreaPostBody>(
      `/api2/orgs/${orgId}/areas`,
      data
    );
    const translated = {
      description: created.description,
      id: created.id.toString(),
      organization: {
        id: created.organization_id,
      },
      points: created.boundary.coordinates[0],
      tags: [],
      title: created.title,
    };

    dispatch(areaCreated(translated));

    return translated;
  };
}
