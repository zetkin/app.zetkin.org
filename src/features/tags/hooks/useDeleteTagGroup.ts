import { useCallback } from 'react';

import { tagGroupDeleted } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import useTagMutations from 'features/tags/hooks/useTagMutations';
import useRemoteListMapping from 'utils/hooks/useRemoteListMapping';

export default function useDeleteTagGroup(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { updateTag } = useTagMutations(orgId);

  const tagIndex = useAppSelector((state) => state.tags.orgTags[orgId]);
  const tagsById = useAppSelector((state) => state.tags.tagsById);
  const tagMapper = useCallback(
    (tags: number[]) =>
      tags
        .map((tagId) => tagsById[tagId])
        .filter((tagItem) => !!tagItem)
        .filter((tagItem) => !tagItem.deleted)
        .map((tagItem) => tagItem.data)
        .filter((tag) => !!tag),
    [tagsById]
  );
  const tagListState = useRemoteListMapping(tagIndex, tagMapper);

  return async (tagGroupId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/tag_groups/${tagGroupId}`);
    dispatch(tagGroupDeleted([tagGroupId]));

    for (const tagItem of tagListState?.items ?? []) {
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
