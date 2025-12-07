import { eventsLoad, eventsLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import useRemoteList from 'core/hooks/useRemoteList';

export default function useUpcomingEvents(orgId: number): ZetkinEvent[] {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.call.upcomingEventsList);

  const todaysDate = new Date().toISOString().split('T')[0];

  return useRemoteList(list, {
    actionOnLoad: () => eventsLoad(),
    actionOnSuccess: (data) => eventsLoaded(data),
    cacheKey: `upcoming-events-${orgId}`,
    loader: async () => {
      const filterParam = encodeURIComponent(`start_time>${todaysDate}`);
      const url = `/api/orgs/${orgId}/actions?filter=${filterParam}`;
      const events = await apiClient.get<ZetkinEvent[]>(url);
      return events.filter((event) => !!event.published);
    },
  });
}
