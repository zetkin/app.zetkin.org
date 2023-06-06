import getOffsetStartEnd from '../components/SelectionBar/getOffsetStartEnd';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function getNewEventTimes(event: ZetkinEvent, offset: number) {
  const currentEventStart = new Date(event.start_time);
  const currentEventEnd = new Date(event.end_time);

  const eventLength = currentEventEnd.getTime() - currentEventStart.getTime();

  const [newStart] = getOffsetStartEnd([event], offset);
  const newEnd = new Date(newStart.getTime() + eventLength);

  const newStartTime = new Date(
    Date.UTC(
      newStart.getUTCFullYear(),
      newStart.getUTCMonth(),
      newStart.getUTCDate(),
      newStart.getUTCHours(),
      newStart.getUTCMinutes()
    )
  );
  const newEndTime = new Date(
    Date.UTC(
      newEnd.getUTCFullYear(),
      newEnd.getUTCMonth(),
      newEnd.getDate(),
      newEnd.getUTCHours(),
      newEnd.getUTCMinutes()
    )
  );

  return {
    newEndTime,
    newStartTime,
  };
}
