import { useApiClient, useAppDispatch } from 'core/hooks';
import { NewTag } from '../components/TagManager/types';
import useCreateTagGroup from './useCreateTagGroup';

export default function useCreateTag(orgId: number) {
  //   const apiClient = useApiClient();
  //   const dispatch = useAppDispatch();

  const createTag = async (tag: NewTag) => {
    if ('group' in tag) {
      const newGroup = useCreateTagGroup(orgId, tag.group);
      if (newGroup) {
        const tagWithNewGroup = {
          ...tag,
          group: undefined,
          group_id: newGroup.id,
        };
      }
      //dispatch blah?
    } else {
      //dispatch blah
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
