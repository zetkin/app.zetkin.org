import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { activeCampaignsLoad, activeCampaignsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useActiveCampaigns(
  orgId: number
): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.call.activeCampaignsList);
  const dispatch = useAppDispatch();

  const todaysDate = new Date().toISOString().split('T')[0];

  const activeCampaignsList = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => activeCampaignsLoad(),
    actionOnSuccess: (data) => activeCampaignsLoaded(data),
    loader: () => {
      const filterParam = encodeURIComponent(`start_time>${todaysDate}`);
      const url = `/api/orgs/${orgId}/actions?filter=${filterParam}`;
      return apiClient.get<ZetkinEvent[]>(url);
    },
  });

  return activeCampaignsList;
}
