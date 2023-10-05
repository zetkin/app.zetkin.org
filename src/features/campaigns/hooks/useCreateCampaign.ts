import { useApiClient } from 'core/hooks';
import { useDispatch } from 'react-redux';
import { campaignCreate, campaignCreated } from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { ZetkinCampaign, ZetkinCampaignPostBody } from 'utils/types/zetkin';

interface UseCreateCampaignReturn {
  createCampaign: (
    campaignBody: ZetkinCampaignPostBody
  ) => IFuture<ZetkinCampaign>;
}

export default function useCreateCampaign(
  orgId: number
): UseCreateCampaignReturn {
  const apiClient = useApiClient();
  const dispatch = useDispatch();

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

  return { createCampaign };
}
