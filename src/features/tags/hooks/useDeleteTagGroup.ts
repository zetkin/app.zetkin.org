import { tagGroupDeleted } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useTagMutations from 'features/tags/hooks/useTagMutations';

export default function useDeleteTag(orgId: number) {
  const tagList = useAppSelector((state) => state.tags.tagList);
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { updateTag } = useTagMutations(orgId);

  return async (tagGroupId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/tag_groups/${tagGroupId}`);
    dispatch(tagGroupDeleted(tagGroupId));

    for (const tagItem of tagList.items) {
      if (tagItem.data?.group?.id == tagGroupId) {
        await updateTag({
          ...tagItem.data,
          group: undefined,
          group_id: undefined,
        });
      }
    }
  };
}
