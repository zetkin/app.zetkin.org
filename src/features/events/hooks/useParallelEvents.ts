import useAllEvents from './useAllEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import { dateIsAfter, dateIsBefore, isSameDate } from 'utils/dateUtils';
import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default function useParallelEvents(
  orgId: number,
  startString: string,
  endString: string
): IFuture<ZetkinEvent[]> {
  const allEvents = useAllEvents(orgId);

  if (allEvents.isLoading) {
    return new LoadingFuture();
  } else if (allEvents.error) {
    return new ErrorFuture(allEvents.error);
  }

  const start = new Date(startString);
  const end = new Date(endString);

  const filteredEvents = allEvents?.data?.filter((event) => {
    const eventStart = new Date(event.start_time);
    const eventEnd = new Date(event.end_time);

    return (
      isSameDate(start, eventStart) ||
      (dateIsBefore(start, eventStart) && dateIsAfter(start, eventEnd)) ||
      (dateIsAfter(start, eventStart) && dateIsBefore(end, eventStart))
    );
  });

  return new ResolvedFuture(filteredEvents || []);
}
