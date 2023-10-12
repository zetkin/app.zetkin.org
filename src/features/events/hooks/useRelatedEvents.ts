import useAllEvents from './useAllEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default function useRelatedEvents(
  currentEvent: ZetkinEvent,
  orgId: number
): IFuture<ZetkinEvent[]> {
  const relatedEvents: ZetkinEvent[] = [];
  const allEvents = useAllEvents(orgId);

  if (allEvents.isLoading) {
    return new LoadingFuture();
  } else if (allEvents.error) {
    return new ErrorFuture(allEvents.error);
  }

  if (!allEvents.data) {
    return new ResolvedFuture(relatedEvents);
  }
  for (const event of allEvents.data) {
    if (event.id !== currentEvent.id) {
      //check if it's same start date or same end date and same location and activity
      if (
        currentEvent.start_time == event.end_time ||
        currentEvent.end_time == event.start_time
      ) {
        if (
          event.activity?.id == currentEvent.activity?.id &&
          event.location?.id == currentEvent.location?.id
        ) {
          relatedEvents.push(event);
        }
      }

      //check if event is exactly in parallel with same event type
      if (
        currentEvent.start_time == event.start_time &&
        currentEvent.end_time == event.end_time &&
        event.activity?.id == currentEvent.activity?.id
      ) {
        relatedEvents.push(event);
      }
    }
  }
  return new ResolvedFuture(relatedEvents || []);
}
