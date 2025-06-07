import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinAppliedTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';

type UseAreaTaggingReturn = {
  assignTag: (tagId: number, value?: string | number | null) => void;
  unassignTag: (tagId: number) => void;
};

export default function useAreaTagging(
  orgId: number,
  areaId: number
): UseAreaTaggingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    assignTag: async (tagId, value) => {
      const tag = await apiClient.put<ZetkinAppliedTag>(
        `/beta/orgs/${orgId}/areas/${areaId}/tags/${tagId}`,
        value ? { value } : undefined // don't send emty value
      );
      dispatch(tagAssigned([areaId, tag]));
    },
    unassignTag: async (tagId) => {
      await apiClient.delete(
        `/beta/orgs/${orgId}/areas/${areaId}/tags/${tagId}`
      );
      dispatch(tagUnassigned([areaId, tagId]));
    },
  };
}
