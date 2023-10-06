import { generateRandomColor } from 'utils/colorUtils';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinCampaign } from 'utils/types/zetkin';
import { campaignsLoad, campaignsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseCampaignsReturn {
  data: ZetkinCampaign[] | null;
}

export default function useCampaigns(orgId: number): UseCampaignsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const campaignsList = useAppSelector((state) => state.campaigns.campaignList);

  const campaignsFuture = loadListIfNecessary(campaignsList, dispatch, {
    actionOnLoad: () => campaignsLoad(),
    actionOnSuccess: (data) => {
      const dataWithColor = data.map((campaign) => ({
        ...campaign,
        color: generateRandomColor(campaign.id.toString()),
      }));
      return campaignsLoaded(dataWithColor);
    },
    loader: () =>
      apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns/`),
  });

  return { data: campaignsFuture.data };
}
