import { activeEventsLoad, activeEventsLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useActiveEvents(orgId: number): ZetkinEvent[] {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.call.activeEventList);

  const todaysDate = new Date().toISOString().split('T')[0];

  return useRemoteList(list, {
    actionOnLoad: () => activeEventsLoad(),
    actionOnSuccess: (data) => activeEventsLoaded(data),
    loader: () => {
      const filterParam = encodeURIComponent(`start_time>${todaysDate}`);
      const url = `/api/orgs/${orgId}/actions?filter=${filterParam}`;
      return apiClient.get<ZetkinEvent[]>(url);
    },
  });
}
