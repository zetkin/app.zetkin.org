import { typeDeleted } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useDeleteType(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (typeId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/activities/${typeId}`);
    dispatch(typeDeleted(typeId));
  };
}
