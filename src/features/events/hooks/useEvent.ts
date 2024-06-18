import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventLoad, eventLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEvent(
  orgId: number,
  id: number
): IFuture<ZetkinEvent> | null {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventList = useAppSelector((state) => state.events.eventList);

  const item = eventList.items.find((item) => item.id == id);

  if (item && item.deleted) {
    return null;
  }

  const eventFuture = loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => eventLoad(id),
    actionOnSuccess: (event) => eventLoaded(event),
    loader: () =>
      apiClient.get<ZetkinEvent>(`/api/orgs/${orgId}/actions/${id}`),
  });

  return eventFuture;
}
