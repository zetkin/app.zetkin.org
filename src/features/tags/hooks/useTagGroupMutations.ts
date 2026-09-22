import { ZetkinTagGroupPatchBody } from '../components/TagManager/types';
import { tagGroupUpdate, tagGroupUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTagGroup } from 'utils/types/zetkin';

type UseTagGroupMutationsReturn = {
  updateTagGroup: (tag: ZetkinTagGroupPatchBody) => Promise<ZetkinTagGroup>;
};

export default function useTagGroupMutations(
  orgId: number
): UseTagGroupMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const updateTagGroup = async (tagGroup: ZetkinTagGroupPatchBody) => {
    dispatch(tagGroupUpdate([tagGroup.id, Object.keys(tagGroup)]));

    const updatedTagGroup = await apiClient.patch<
      ZetkinTagGroup,
      Omit<ZetkinTagGroupPatchBody, 'id'>
    >(`/api/orgs/${orgId}/tag_groups/${tagGroup.id}`, {
      description: tagGroup.description,
      title: tagGroup.title,
    });

    dispatch(tagGroupUpdated(updatedTagGroup));

    return updatedTagGroup;
  };

  return {
    updateTagGroup,
  };
}
