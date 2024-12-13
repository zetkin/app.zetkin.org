import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { allEventsLoad, allEventsLoaded } from '../store';
import getAllEvents from '../rpc/getAllEvents';

export default function useAllEvents() {
  const apiClient = useApiClient();
  const allEventsList = useAppSelector((state) => state.events.allEventsList);

  return useRemoteList(allEventsList, {
    actionOnLoad: () => allEventsLoad(),
    actionOnSuccess: (data) => allEventsLoaded(data),
    loader: () => apiClient.rpc(getAllEvents, {}),
  });
}
