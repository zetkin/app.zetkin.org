import { EditTag } from '../components/TagManager/types';
import useCreateTagGroup from './useCreateTagGroup';
import { tagAssigned, tagUnassigned } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTag, ZetkinTagPatchBody } from 'utils/types/zetkin';

interface UseTagMutationsReturn {
  assignToPerson: (personId: number, tagId: number, value?: string) => void;
  editTag: (tag: EditTag) => Promise<ZetkinTag>;
  removeFromPerson: (personId: number, tagId: number) => Promise<void>;
}
export default function useTagMutations(orgId: number): UseTagMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const createTagGroup = useCreateTagGroup(orgId);

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
  const editTag = async (tag: EditTag) => {
    if ('group' in tag) {
      // If creating a new group, has group object
      const newGroup = await createTagGroup(tag.group);
      const tagWithNewGroup = {
        ...tag,
        group: undefined,
        group_id: newGroup.id,
      };
      //dispatch blah
      // eslint-disable-next-line
      const { id, ...resourceWithoutId } = tagWithNewGroup;
      const tagFuture = await apiClient
        .patch<ZetkinTag, Omit<ZetkinTagPatchBody, 'id'>>(
          `/api/orgs/${orgId}/people/tags/${tag.id}`,
          resourceWithoutId
        )
        .then((data: ZetkinTag) => {
          // dispatch(tagCreated);
          return data;
        });
      return tagFuture;
    } else {
      // Add tag with existing or no group
      const tagPatchFuture = await apiClient
        .patch<ZetkinTag, Omit<ZetkinTagPatchBody, 'id'>>(
          `/api/orgs/${orgId}/people/tags/${tag.id}`,
          {
            color: tag.color,
            group_id: tag.group_id,
            title: tag.title,
            value_type: tag.value_type,
          }
        )
        .then((data) => {
          // dispatch(tagCreated);
          return data;
        });
      return tagPatchFuture;
    }
  };

  const removeFromPerson = async (personId: number, tagId: number) => {
    await apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`
    );
    dispatch(tagUnassigned([personId, tagId]));
  };

  return {
    assignToPerson,
    editTag,
    removeFromPerson,
  };
}
