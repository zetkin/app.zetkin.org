import { ZetkinEvent } from 'utils/types/zetkin';
import { dateIsBefore, isSameDate } from 'utils/dateUtils';

export default function getOffsetStartEnd(
  events: ZetkinEvent[],
  offset: number
) {
  const sortedEvents = events.sort((firstEvent, secondEvent) => {
    const firstEventStartDate = new Date(firstEvent.start_time);
    const secondEventStartDate = new Date(secondEvent.start_time);
    if (dateIsBefore(firstEventStartDate, secondEventStartDate)) {
      return 1;
    } else if (isSameDate(firstEventStartDate, secondEventStartDate)) {
      return 0;
    } else {
      return -1;
    }
  });

  if (sortedEvents.length === 0) {
    return [];
  }

  const firstEventDate = new Date(sortedEvents[0].start_time);
  const lastEventDate = new Date(
    sortedEvents[sortedEvents.length - 1].start_time
  );

  firstEventDate.setDate(firstEventDate.getDate() + offset);
  lastEventDate.setDate(lastEventDate.getDate() + offset);

  return [firstEventDate, lastEventDate];
}
