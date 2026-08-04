import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteListFuture from 'core/hooks/useRemoteListFuture';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { allEventsLoad, allEventsLoaded } from '../../events/store';
import getAllEvents from '../../events/rpc/getAllEvents';
import sortEventsByStartTime from '../../events/utils/sortEventsByStartTime';
import { ZetkinEventWithStatus } from 'features/public/types';
import { useMyEventsFuture } from './useMyEvents';

export default function useAllEvents(): IFuture<ZetkinEventWithStatus[]> {
  const apiClient = useApiClient();
  const allEventsList = useAppSelector((state) => state.events.allEventsList);

  const myEventsFuture = useMyEventsFuture();

  const eventsFuture = useRemoteListFuture(allEventsList, {
    actionOnLoad: () => allEventsLoad(),
    actionOnSuccess: (data) => {
      const sorted = data.sort(sortEventsByStartTime);
      return allEventsLoaded(sorted);
    },
    loader: () => apiClient.rpc(getAllEvents, {}),
  });

  if (!eventsFuture.data || !myEventsFuture.data) {
    return new LoadingFuture();
  }

  const myEvents = myEventsFuture.data;

  return new ResolvedFuture(
    eventsFuture.data.map<ZetkinEventWithStatus>((event) => {
      const myEvent = myEvents.find((candidate) => candidate.id == event.id);

      return (
        myEvent || {
          ...event,
          status: null,
        }
      );
    })
  );
}
