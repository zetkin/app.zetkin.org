import shouldLoad from 'core/caching/shouldLoad';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventLoad, eventLoaded } from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEvent(
  orgId: number,
  id: number
): IFuture<ZetkinEvent> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const eventsState = useAppSelector((state) => state.events);

  const item = eventsState.eventList.items.find((item) => item.id == id);

  if (!item || shouldLoad(item)) {
    dispatch(eventLoad(id));
    const promise = apiClient
      .get<ZetkinEvent>(`/api/orgs/${orgId}/actions/${id}`)
      .then((event) => {
        dispatch(eventLoaded(event));
        return event;
      });
    return new PromiseFuture(promise);
  } else {
    return new RemoteItemFuture(item);
  }
}
