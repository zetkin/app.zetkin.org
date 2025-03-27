import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { activeEventsLoad, activeEventsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useActiveEvents(orgId: number): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.call.activeEventList);
  const dispatch = useAppDispatch();

  const todaysDate = new Date().toISOString().split('T')[0];

  const activeCampaignsList = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => activeEventsLoad(),
    actionOnSuccess: (data) => activeEventsLoaded(data),
    loader: () => {
      const filterParam = encodeURIComponent(`start_time>${todaysDate}`);
      const url = `/api/orgs/${orgId}/actions?filter=${filterParam}`;
      return apiClient.get<ZetkinEvent[]>(url);
    },
  });

  return activeCampaignsList;
}
