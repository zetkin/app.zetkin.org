import { generateRandomColor } from 'utils/colorUtils';
import shouldLoad from 'core/caching/shouldLoad';
import {
  campaignCreate,
  campaignCreated,
  campaignDeleted,
  campaignLoad,
  campaignLoaded,
  campaignUpdate,
  campaignUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinCampaign, ZetkinCampaignPostBody } from 'utils/types/zetkin';

interface UseCampaignReturn {
  createCampaign: (
    campaignBody: ZetkinCampaignPostBody
  ) => IFuture<ZetkinCampaign>;
  data: ZetkinCampaign | null;
  deleteCampaign: () => void;
  updateCampaign: (data: Partial<ZetkinCampaign>) => IFuture<ZetkinCampaign>;
}

export default function useCampaign(
  orgId: number,
  campId: number
): UseCampaignReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const campaignsSlice = useAppSelector((state) => state.campaigns);
  const campaignItems = campaignsSlice.campaignList.items;

  const createCampaign = (
    campaignBody: ZetkinCampaignPostBody
  ): IFuture<ZetkinCampaign> => {
    dispatch(campaignCreate());

    const promise = apiClient
      .post<ZetkinCampaign, ZetkinCampaignPostBody>(
        `/api/orgs/${orgId}/campaigns`,
        campaignBody
      )
      .then((campaign: ZetkinCampaign) => {
        dispatch(campaignCreated(campaign));
        return campaign;
      });

    return new PromiseFuture(promise);
  };

  const getData = (): IFuture<ZetkinCampaign> => {
    const campaignItem = campaignItems.find((item) => item.id == campId);

    if (!campaignItem || shouldLoad(campaignItem)) {
      dispatch(campaignLoad(campId));
      const promise = apiClient
        .get<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/${campId}`)
        .then((data: ZetkinCampaign) => {
          const dataWithColor = {
            ...data,
            color: generateRandomColor(data.id.toString()),
          };
          dispatch(campaignLoaded(dataWithColor));
          return dataWithColor;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(campaignItem);
    }
  };

  const deleteCampaign = () => {
    apiClient.delete(`/api/orgs/${orgId}/campaigns/${campId}`);
    dispatch(campaignDeleted([orgId, campId]));
  };

  const updateCampaign = (
    data: Partial<ZetkinCampaign>
  ): IFuture<ZetkinCampaign> => {
    const mutatingAttributes = Object.keys(data);

    dispatch(campaignUpdate([campId, mutatingAttributes]));
    const promise = apiClient
      .patch<ZetkinCampaign>(`/api/orgs/${orgId}/campaigns/${campId}`, data)
      .then((data: ZetkinCampaign) => {
        dispatch(campaignUpdated(data));
        return data;
      });

    return new PromiseFuture(promise);
  };

  const { data } = getData();
  return { createCampaign, data, deleteCampaign, updateCampaign };
}
