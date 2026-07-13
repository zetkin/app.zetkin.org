import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseTaggingReturn {
  assignToPerson: (
    personId: number,
    tagId: number,
    value?: ZetkinAppliedTag['value']
  ) => Promise<void>;
  removeFromPerson: (personId: number, tagId: number) => Promise<void>;
}

export default function useTagging(orgId: number): UseTaggingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const assignToPerson = async (
    personId: number,
    tagId: number,
    value?: ZetkinAppliedTag['value']
  ) => {
    const data = value ? { value } : undefined;
    const tag = await apiClient.put<ZetkinAppliedTag>(
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
