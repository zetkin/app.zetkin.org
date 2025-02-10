import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { allEventsLoad, allEventsLoaded } from '../store';
import getAllEvents from '../rpc/getAllEvents';
import sortEventsByStartTime from '../utils/sortEventsByStartTime';
import { ZetkinEventWithStatus } from 'features/home/types';
import useMyEvents from './useMyEvents';

export default function useAllEvents() {
  const apiClient = useApiClient();
  const allEventsList = useAppSelector((state) => state.events.allEventsList);

  const myEvents = useMyEvents();

  const events = useRemoteList(allEventsList, {
    actionOnLoad: () => allEventsLoad(),
    actionOnSuccess: (data) => {
      const sorted = data.sort(sortEventsByStartTime);
      return allEventsLoaded(sorted);
    },
    loader: () => apiClient.rpc(getAllEvents, {}),
  });

  return events.map<ZetkinEventWithStatus>((event) => {
    const myEvent = myEvents.find((candidate) => candidate.id == event.id);

    return (
      myEvent || {
        ...event,
        status: null,
      }
    );
  });
}
