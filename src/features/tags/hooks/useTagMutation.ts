import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseTagMutationReturn {
  assignToPerson: (personId: number, tagId: number, value?: string) => void;
  removeFromPerson: (personId: number, tagId: number) => Promise<void>;
}
export default function useTagMutation(orgId: number): UseTagMutationReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const assignToPerson = async (
    personId: number,
    tagId: number,
    value?: string
  ) => {
    const data = value ? { value } : undefined;
    const tag = await apiClient.put<ZetkinTag>(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`,
      data
    );
    dispatch(tagAssigned([personId, tag]));
  };

  const removeFromPerson = async (personId: number, tagId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`
    );
    dispatch(tagUnassigned([personId, tagId]));
  };

  return {
    assignToPerson,
    removeFromPerson,
  };
}
