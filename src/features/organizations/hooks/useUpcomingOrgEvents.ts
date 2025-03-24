import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinEvent } from 'utils/types/zetkin';
import { orgEventsLoad, orgEventsLoaded } from '../store';
import getUpcomingOrgEvents from '../rpc/getUpcomingOrgEvents';

export default function useUpcomingOrgEvents(orgId: number): ZetkinEvent[] {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.organizations.eventsByOrgId[orgId]
  );
  return useRemoteList(list, {
    actionOnLoad: () => orgEventsLoad(orgId),
    actionOnSuccess: (data) => orgEventsLoaded([orgId, data]),
    loader: () => apiClient.rpc(getUpcomingOrgEvents, { orgId }),
  });
}
