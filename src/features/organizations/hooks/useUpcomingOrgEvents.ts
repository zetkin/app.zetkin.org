import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinEvent } from 'utils/types/zetkin';
import { orgEventsLoad, orgEventsLoaded } from '../store';

export default function useUpcomingOrgEvents(orgId: number): ZetkinEvent[] {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.organizations.eventsByOrgId[orgId]
  );

  const now = new Date().toISOString();

  return useRemoteList(list, {
    actionOnLoad: () => orgEventsLoad(orgId),
    actionOnSuccess: (data) => orgEventsLoaded([orgId, data]),
    loader: () =>
      apiClient.get<ZetkinEvent[]>(
        `/api/orgs/${orgId}/actions?recursive&filter=start_time%3E=${now}`
      ),
  });
}
