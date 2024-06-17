import useEventsFromDateRange from './useEventsFromDateRange';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { IFuture, ResolvedFuture } from 'core/caching/futures';

export default function useRelatedEvents(
  currentEvent: ZetkinEvent,
  orgId: number
): IFuture<ZetkinEvent[]> {
  const relatedEvents: ZetkinEvent[] = [];
  const start = new Date(currentEvent.start_time);
  const end = new Date(currentEvent.end_time);
  const { campId } = useNumericRouteParams();
  const allEventsInActivities = useEventsFromDateRange(
    start,
    end,
    orgId,
    campId
  );

  const allEvents = allEventsInActivities
    .map((event) => event.data)
    .filter((event) => orgId == event.organization.id);

  if (allEvents.length === 0) {
    return new ResolvedFuture(relatedEvents);
  }

  for (const event of allEvents) {
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
