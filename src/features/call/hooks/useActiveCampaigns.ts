import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinAction } from '../types';
import { activeCampaignsLoad, activeCampaignsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useActiveCampaigns(
  orgId: number
): IFuture<ZetkinAction[]> {
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
      return apiClient.get<ZetkinAction[]>(url);
    },
  });

  return activeCampaignsList;
}
