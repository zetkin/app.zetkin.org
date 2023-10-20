import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTag } from 'utils/types/zetkin';
import { NewTag } from '../components/TagManager/types';
import useCreateTagGroup from './useCreateTagGroup';

export default function useCreateTag(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  //   return (tag: NewTag): IFuture<ZetkinTag> => {
  //     if ('group' in tag) {
  //       const newGroup = useCreateTagGroup(orgId);
  //       const tagWithNewGroup = {
  //         ...tag,
  //         group: undefined,
  //         group_id: newGroup.id,
  //       };
  //       //dispatch어쩌고 하면 될듯?
  //     } else {
  //       //dispatch어쩌고
  //     }
  //   };
  const createTag = async (tag: NewTag) => {
    if ('group' in tag) {
      const newGroup = await useCreateTagGroup(orgId, tag.group);
      //   const newGroup = await createGroup(tag);
      const tagWithNewGroup = {
        ...tag,
        group: undefined,
        group_id: newGroup.id,
      };
      //dispatch어쩌고 하면 될듯?
    } else {
      //dispatch어쩌고
    }
  };
  //   return (campaignBody: ZetkinCampaignPostBody): IFuture<ZetkinCampaign> => {
  //     dispatch(campaignCreate());

  //     const promise = apiClient
  //       .post<ZetkinCampaign, ZetkinCampaignPostBody>(
  //         `/api/orgs/${orgId}/campaigns`,
  //         campaignBody
  //       )
  //       .then((campaign: ZetkinCampaign) => {
  //         dispatch(campaignCreated(campaign));
  //         return campaign;
  //       });

  //     return new PromiseFuture(promise);
  //   };
}
