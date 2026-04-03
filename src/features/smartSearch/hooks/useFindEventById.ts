import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import findEventById from 'features/smartSearch/rpc/findEventById';
import {
  eventsByEventIdLoad,
  eventsByEventIdLoaded,
} from 'features/smartSearch/store';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useFindEventById(
  eventId: number
): IFuture<ZetkinEvent | null> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const statsItem = useAppSelector(
    (state) => state.smartSearch.eventsByEventId[eventId]
  );

  return loadItemIfNecessary(statsItem, dispatch, {
    actionOnLoad: () => eventsByEventIdLoad(eventId),
    actionOnSuccess: (event) => eventsByEventIdLoaded([eventId, event]),
    loader: () => apiClient.rpc(findEventById, { eventId }).catch(() => null),
  });
}
