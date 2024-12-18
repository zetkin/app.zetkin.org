import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinLocation, ZetkinLocationPostBody } from '../types';
import { locationCreated } from '../store';

export default function useCreateLocation(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createLocation(data: ZetkinLocationPostBody) {
    const created = await apiClient.post<
      ZetkinLocation,
      ZetkinLocationPostBody
    >(`/beta/orgs/${orgId}/locations`, data);
    dispatch(locationCreated(created));
  };
}
