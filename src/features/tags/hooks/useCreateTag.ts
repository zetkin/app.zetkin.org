import { NewTag } from '../components/TagManager/types';
import useCreateTagGroup from './useCreateTagGroup';
import { tagCreate, tagCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTag, ZetkinTagPostBody } from 'utils/types/zetkin';

export default function useCreateTag(
  orgId: number
): (tag: NewTag) => Promise<ZetkinTag> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const createTagGroup = useCreateTagGroup(orgId);

  const createTag = async (tag: NewTag): Promise<ZetkinTag> => {
    if ('group' in tag) {
      const newGroup = await createTagGroup(tag.group);
      const tagWithNewGroup = {
        ...tag,
        group: undefined,
        group_id: newGroup.id,
      };
      dispatch(tagCreate());
      const tagFuture = await apiClient
        .post<ZetkinTag, ZetkinTagPostBody>(
          `/api/orgs/${orgId}/people/tags`,
          tagWithNewGroup
        )
        .then((data: ZetkinTag) => {
          dispatch(tagCreated(data));
          return data;
        });
      return tagFuture;
    } else {
      const tagFuture = await apiClient
        .post<ZetkinTag, ZetkinTagPostBody>(
          `/api/orgs/${orgId}/people/tags`,
          tag
        )
        .then((data: ZetkinTag) => {
          //   dispatch(tagGroupCreated);
          return data;
        });
      return tagFuture;
    }
  };
  return createTag;
}
