import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPlace, ZetkinPlacePatchBody } from '../types';
import { placeUpdated } from '../store';

export default function usePlaceMutations(orgId: number, placeId: string) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (data: ZetkinPlacePatchBody) => {
    const area = await apiClient.patch<ZetkinPlace, ZetkinPlacePatchBody>(
      `/beta/orgs/${orgId}/places/${placeId}`,
      data
    );
    dispatch(placeUpdated(area));
  };
}
