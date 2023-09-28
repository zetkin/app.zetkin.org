import { useStore } from 'react-redux';

import { useApiClient } from 'core/hooks';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';

interface UseTagMutationReturn {
  assignToPerson: (personId: number, value?: string) => void;
  removeFromPerson: (personId: number) => Promise<void>;
}
export default function useTagMutation(
  orgId: number,
  tagId: number
): UseTagMutationReturn {
  const apiClient = useApiClient();

  const store = useStore();

  const assignToPerson = async (personId: number, value?: string) => {
    const data = value ? { value } : undefined;
    const tag = await apiClient.put<ZetkinTag>(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`,
      data
    );
    store.dispatch(tagAssigned([personId, tag]));
  };

  const removeFromPerson = async (personId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`
    );
    store.dispatch(tagUnassigned([personId, tagId]));
  };

  return {
    assignToPerson,
    removeFromPerson,
  };
}
