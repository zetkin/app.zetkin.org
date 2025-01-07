import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';

type UseAreaTaggingReturn = {
  assignTag: (tagId: number, value?: string | number | null) => void;
  unassignTag: (tagId: number) => void;
};

export default function useAreaTagging(
  orgId: number,
  areaId: string
): UseAreaTaggingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    assignTag: async (tagId, value) => {
      const tag = await apiClient.put<ZetkinTag>(
        `/beta/orgs/${orgId}/areas/${areaId}/tags/${tagId}`,
        { value }
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
