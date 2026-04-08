import { campaignCreate, campaignCreated } from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinCampaign, ZetkinCampaignPostBody } from 'utils/types/zetkin';

export default function useCreateCampaign(
  orgId: number
): (campaignBody: ZetkinCampaignPostBody) => IFuture<ZetkinCampaign> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return (campaignBody: ZetkinCampaignPostBody): IFuture<ZetkinCampaign> => {
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
}
