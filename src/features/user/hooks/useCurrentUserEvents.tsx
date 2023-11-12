import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsLoad, eventsLoaded } from '../../events/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useCurrentUserEvents(): IFuture<ZetkinEvent[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const events = useAppSelector((state) => state.events.eventList);

  const eventFuture = loadListIfNecessary(events, dispatch, {
    actionOnLoad: () => eventsLoad(),
    actionOnSuccess: (events) => eventsLoaded(events),
    loader: () => apiClient.get<ZetkinEvent[]>(`/api/users/me/actions`),
  });

  return eventFuture;
}
