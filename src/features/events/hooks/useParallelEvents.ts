import useEventsFromDateRange from './useEventsFromDateRange';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { dateIsAfter, dateIsBefore, isSameDate } from 'utils/dateUtils';

export default function useParallelEvents(
  orgId: number,
  startString: string,
  endString: string
): ZetkinEvent[] {
  const start = new Date(startString);
  const end = new Date(endString);

  const { projectId } = useNumericRouteParams();
  const allEvents = useEventsFromDateRange(start, end, orgId, projectId);

  const filteredEvents = allEvents
    .filter((event) => {
      const eventStart = new Date(event.data.start_time);
      const eventEnd = new Date(event.data.end_time);

      return (
        isSameDate(start, eventStart) ||
        (dateIsAfter(start, eventStart) && dateIsBefore(start, eventEnd)) ||
        (dateIsBefore(start, eventStart) && dateIsAfter(end, eventStart))
      );
    })
    .filter((event) => event.data.organization.id === orgId)
    .map((event) => event.data);

  return filteredEvents || [];
}
