import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { campaignsLoad, campaignsLoaded } from '../store';
import { ZetkinCampaign } from 'utils/types/zetkin';

export default function usePublicCampaigns(orgId: number) {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.organizations.campaignsByOrgId[orgId]
  );

  return useRemoteList(list, {
    actionOnLoad: () => campaignsLoad(orgId),
    actionOnSuccess: (data) => {
      return campaignsLoaded([orgId, data]);
    },
    loader: () =>
      apiClient.get<ZetkinCampaign[]>(`/api/orgs/${orgId}/campaigns`),
  });
}
