import { PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTagGroup } from 'utils/types/zetkin';
import { NewTag, ZetkinTagGroupPostBody } from '../components/TagManager/types';

export default function useCreateTagGroup(orgId: number, newGroup: NewTag) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  // dispatch(campaignCreate());
  const promise = apiClient
    .post<ZetkinTagGroup, ZetkinTagGroupPostBody>(
      `/api/orgs/${orgId}/tag_groups`,
      newGroup
    )
    .then((data: ZetkinTagGroup) => {
      // dispatch(campaignCreated(campaign));
      return data;
    });
  return new PromiseFuture(promise).data;
}
