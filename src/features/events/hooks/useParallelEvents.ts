import useEventsFromDateRange from './useEventsFromDateRange';
import { ZetkinEvent } from 'utils/types/zetkin';
import { dateIsAfter, dateIsBefore, isSameDate } from 'utils/dateUtils';

export default function useParallelEvents(
  orgId: number,
  startString: string,
  endString: string
): ZetkinEvent[] {
  const start = new Date(startString);
  const end = new Date(endString);

  const allEvents = useEventsFromDateRange(start, end);

  const filteredEvents = allEvents
    .filter((event) => {
      const eventStart = new Date(event.data.start_time);
      const eventEnd = new Date(event.data.end_time);

      return (
        isSameDate(start, eventStart) ||
        (dateIsBefore(start, eventStart) && dateIsAfter(start, eventEnd)) ||
        (dateIsAfter(start, eventStart) && dateIsBefore(end, eventStart))
      );
    })
    .filter((event) => event.data.organization.id === orgId)
    .map((event) => event.data);

  return filteredEvents || [];
}
