import useEventsFromDateRange from './useEventsFromDateRange';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { isPlainDateAfter, isPlainDateBefore } from 'utils/dateUtils';

export default function useParallelEvents(
  orgId: number,
  startString: string,
  endString: string
): ZetkinEvent[] {
  const start = Temporal.PlainDate.from(startString);
  const end = Temporal.PlainDate.from(endString);

  const { campId } = useNumericRouteParams();
  const allEvents = useEventsFromDateRange(start, end, orgId, campId);

  const filteredEvents = allEvents
    .filter((event) => {
      const eventStart = Temporal.PlainDate.from(event.data.start_time);
      const eventEnd = Temporal.PlainDate.from(event.data.end_time);

      return (
        start.equals(end) ||
        (isPlainDateAfter(start, eventStart) &&
          isPlainDateBefore(start, eventEnd)) ||
        (isPlainDateBefore(start, eventStart) &&
          isPlainDateAfter(end, eventStart))
      );
    })
    .filter((event) => event.data.organization.id === orgId)
    .map((event) => event.data);

  return filteredEvents || [];
}
