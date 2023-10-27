import { EditTag } from '../components/TagManager/types';
import useCreateTagGroup from './useCreateTagGroup';
import { tagUpdate, tagUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTag, ZetkinTagPatchBody } from 'utils/types/zetkin';

type UseTagMutationsReturn = {
  updateTag: (tag: EditTag) => Promise<ZetkinTag>;
};

export default function useTagMutations(orgId: number): UseTagMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const createTagGroup = useCreateTagGroup(orgId);

  const updateTag = async (tag: EditTag) => {
    if ('group' in tag) {
      // If creating a new group, has group object
      const newGroup = await createTagGroup(tag.group);
      const tagWithNewGroup = {
        ...tag,
        group: undefined,
        group_id: newGroup.id,
      };
      dispatch(tagUpdate([tag.id, Object.keys(tagWithNewGroup)]));
      // eslint-disable-next-line
      const { id, ...resourceWithoutId } = tagWithNewGroup;
      const tagFuture = await apiClient
        .patch<ZetkinTag, Omit<ZetkinTagPatchBody, 'id'>>(
          `/api/orgs/${orgId}/people/tags/${tag.id}`,
          resourceWithoutId
        )
        .then((data: ZetkinTag) => {
          dispatch(tagUpdated(data));
          return data;
        });
      return tagFuture;
    } else {
      // Add tag with existing or no group
      dispatch(tagUpdate([tag.id, Object.keys(tag)]));
      const tagFuture = await apiClient
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
          dispatch(tagUpdated(data));
          return data;
        });

      return tagFuture;
    }
  };

  return {
    updateTag,
  };
}
