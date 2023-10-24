import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsLoad, eventsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useAllEvents(orgId: number): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventList = useAppSelector((state) => state.events.eventList);

  return loadListIfNecessary(eventList, dispatch, {
    actionOnLoad: () => eventsLoad(),
    actionOnSuccess: (events) => eventsLoaded(events),
    loader: () => apiClient.get<ZetkinEvent[]>(`/api/orgs/${orgId}/actions`),
  });
}
