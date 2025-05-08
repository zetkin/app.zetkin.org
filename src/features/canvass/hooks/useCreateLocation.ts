import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinLocation } from '../../areaAssignments/types';
import { locationCreated } from '../../areaAssignments/store';
import { ZetkinLocationPostBody } from '../types';

export default function useCreateLocation(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async function createLocation(data: ZetkinLocationPostBody) {
    const created = await apiClient.post<
      ZetkinLocation,
      ZetkinLocationPostBody
    >(`/api2/orgs/${orgId}/locations`, data);
    dispatch(locationCreated(created));
  };
}
