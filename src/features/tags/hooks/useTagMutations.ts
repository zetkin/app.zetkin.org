import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseTagMutationsReturn {
  assignToPerson: (personId: number, value?: string) => void;
  removeFromPerson: (personId: number) => Promise<void>;
}
export default function useTagMutations(
  orgId: number,
  tagId: number
): UseTagMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const assignToPerson = async (
    personId: number,

    value?: string
  ) => {
    const data = value ? { value } : undefined;
    const tag = await apiClient.put<ZetkinTag>(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`,
      data
    );
    dispatch(tagAssigned([personId, tag]));
  };
  const removeFromPerson = async (personId: number) => {
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
