import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinTag, ZetkinTagGroup } from 'utils/types/zetkin';
import { TagManagerControllerProps } from '../components/TagManager/TagManagerController';
import {
  NewTag,
  NewTagGroup,
  ZetkinTagGroupPostBody,
} from '../components/TagManager/types';

export default function useCreateTagGroup(orgId: number, newGroup: NewTag) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  //   const createGroup = async (newGroup: NewTag) => {
  //     const tagGroup = await apiClient.post<
  //       ZetkinTagGroup,
  //       ZetkinTagGroupPostBody
  //     >(`/api/orgs/${orgId}/tag_groups`, newGroup);
  //     // dispatch(folderCreated(folder));
  //     return tagGroup;
  //   };

  //   return async () => {
  //     // dispatch(folderCreate());
  //     const tagGroup = await apiClient.post<
  //       ZetkinTagGroup,
  //       ZetkinTagGroupPostBody
  //     >(`/api/orgs/${orgId}/tag_groups`, newGroup);
  //     // dispatch(folderCreated(folder));
  //     return tagGroup;
  //   };
  //   return createTagGroup;
  return (newGroup: NewTag): IFuture<ZetkinTagGroup> => {
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
    return new PromiseFuture(promise);
  };
}
