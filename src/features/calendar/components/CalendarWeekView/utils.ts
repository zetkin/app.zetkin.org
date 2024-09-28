import type { AnyClusteredEvent } from 'features/calendar/utils/clusterEventsForWeekCalender';
export function scrollToEarliestEvent(
  weekElement: HTMLDivElement | undefined,
  laneHeight: number,
  eventsByDate: AnyClusteredEvent[][][]
) {
  if (!weekElement) {
    return;
  }
  // pick out all event start times and sort by time in day
  const arr = eventsByDate
    .flat()
    .flat()
    .flatMap((e) => e.events)
    .map((e) => e.start_time)
    .map((e) => new Date(e))
    .sort((left, right) => {
      const leftTime = left.getUTCHours() + left.getUTCMinutes() / 60;
      const rightTime = right.getUTCHours() + right.getUTCMinutes() / 60;
      return leftTime - rightTime;
    });
  if (arr.length === 0) {
    return;
  }

  const earliestTime = arr[0];
  const timePosition =
    (earliestTime.getUTCHours() + earliestTime.getUTCMinutes() / 60 - 0.1) / 24;
  const heightInPixels = timePosition * laneHeight;

  weekElement.scrollTo({ behavior: 'smooth', top: heightInPixels });
}

export function getDSTOffset(date: Date): number {
  const jan = new Date(date.getFullYear(), 0, 1).getTimezoneOffset();
  const jul = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
  return (date.getTimezoneOffset() - Math.max(jan, jul)) / 60;
}
