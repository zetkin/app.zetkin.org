import { tagDeleted } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useDeleteTag(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (tagId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/people/tags/${tagId}`);
    dispatch(tagDeleted(tagId));
  };
}
