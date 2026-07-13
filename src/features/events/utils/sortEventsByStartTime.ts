import { ZetkinEvent } from 'utils/types/zetkin';

export default function sortEventsByStartTime(a: ZetkinEvent, b: ZetkinEvent) {
  const aStart = new Date(a.start_time);
  const bStart = new Date(b.start_time);
  const diffStart = aStart.getTime() - bStart.getTime();

  // Primarily sort by start time
  if (diffStart != 0) {
    return diffStart;
  }

  // When start times are identical, sort by end time
  const aEnd = new Date(a.end_time);
  const bEnd = new Date(b.end_time);

  return aEnd.getTime() - bEnd.getTime();
}
