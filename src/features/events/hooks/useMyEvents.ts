import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { userEventsLoad, userEventsLoaded } from '../store';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useMyEvents() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.events.userEventList);

  return useRemoteList(list, {
    actionOnLoad: () => userEventsLoad(),
    actionOnSuccess: (data) => userEventsLoaded(data),
    loader: () => apiClient.get<ZetkinEvent[]>(`/api/users/me/actions`),
  });
}
