import { generateRandomColor } from 'utils/colorUtils';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinCampaign } from 'utils/types/zetkin';
import {
  campaignDeleted,
  campaignLoad,
  campaignLoaded,
  campaignUpdate,
  campaignUpdated,
} from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseCampaignReturn {
  campaignFuture: IFuture<ZetkinCampaign>;
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

  const campaignItem = campaignItems.find((item) => item.id == campId);

  const campaignFuture = loadItemIfNecessary(campaignItem, dispatch, {
    actionOnLoad: () => campaignLoad(campId),
    actionOnSuccess: (data) => campaignLoaded(data),
    loader: async () => {
      const campaign = await apiClient.get<ZetkinCampaign>(
        `/api/orgs/${orgId}/campaigns/${campId}`
      );
      return {
        ...campaign,
        color: generateRandomColor(campaign.id.toString()),
      };
    },
  });

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

  return { campaignFuture, deleteCampaign, updateCampaign };
}
