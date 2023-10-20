import { ZetkinTagGroup } from 'utils/types/zetkin';
import { NewTag, ZetkinTagGroupPostBody } from '../components/TagManager/types';
import { tagGroupCreate, tagGroupCreated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useCreateTagGroup(
  orgId: number
): (newGroup: NewTag) => Promise<ZetkinTagGroup> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createTagGroup = async (newGroup: NewTag) => {
    dispatch(tagGroupCreate);
    const tagGroupFuture = await apiClient
      .post<ZetkinTagGroup, ZetkinTagGroupPostBody>(
        `/api/orgs/${orgId}/tag_groups`,
        newGroup
      )
      .then((data: ZetkinTagGroup) => {
        dispatch(tagGroupCreated);
        return data;
      });
    return tagGroupFuture;
  };
  return createTagGroup;
}
