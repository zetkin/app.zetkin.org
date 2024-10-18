import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinPlace, ZetkinPlacePostBody } from '../types';
import { placeCreated } from '../store';

export default function useCreatePlace(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createPlace(data: ZetkinPlacePostBody) {
    const created = await apiClient.post<ZetkinPlace, ZetkinPlacePostBody>(
      `/beta/orgs/${orgId}/places`,
      data
    );
    dispatch(placeCreated(created));
  };
}
