import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { allEventsLoad, allEventsLoaded } from '../store';
import getAllEvents from '../rpc/getAllEvents';
import sortEventsByStartTime from '../utils/sortEventsByStartTime';

export default function useAllEvents() {
  const apiClient = useApiClient();
  const allEventsList = useAppSelector((state) => state.events.allEventsList);

  return useRemoteList(allEventsList, {
    actionOnLoad: () => allEventsLoad(),
    actionOnSuccess: (data) => {
      const sorted = data.sort(sortEventsByStartTime);
      return allEventsLoaded(sorted);
    },
    loader: () => apiClient.rpc(getAllEvents, {}),
  });
}
