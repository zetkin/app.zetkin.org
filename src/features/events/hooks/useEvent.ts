import { ZetkinEvent } from 'utils/types/zetkin';
import { eventLoad, eventLoaded } from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useEvent(
  orgId: number,
  id: number
): ZetkinEvent | null {
  const apiClient = useApiClient();
  const eventList = useAppSelector((state) => state.events.eventList);

  const item = eventList.items.find((item) => item.id == id);

  const event = useRemoteItem(item, {
    actionOnLoad: () => eventLoad(id),
    actionOnSuccess: (event) => eventLoaded(event),
    cacheKey: `event-${orgId}-${id}`,
    loader: () =>
      apiClient.get<ZetkinEvent>(`/api/orgs/${orgId}/actions/${id}`),
  });

  if (item && item.deleted) {
    return null;
  }

  return event;
}
