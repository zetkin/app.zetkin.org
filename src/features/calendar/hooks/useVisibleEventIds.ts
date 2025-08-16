import { useEffect, useState } from 'react';

import { useAppSelector, useNumericRouteParams } from 'core/hooks';
import { RootState } from 'core/store';
import { useFocusDate } from 'utils/hooks/useFocusDate';
import useDayCalendarEvents from './useDayCalendarEvents';
import useMonthCalendarEvents from './useMonthCalendarEvents';
import useWeekCalendarEvents from './useWeekCalendarEvents';

export default function useVisibleEventIds() {
  const [visibleEventIds, setVisibleEventIds] = useState<number[]>([]);
  const calendarStore = useAppSelector((state: RootState) => state.calendar);

  const focusDate = useFocusDate();
  const { orgId, campId } = useNumericRouteParams();

  const monthCalendarEvents = useMonthCalendarEvents({
    campaignId: campId,
    maxPerDay: calendarStore.maxMonthEventsPerDay,
    orgId,
  });

  const weekCalendarEvents = useWeekCalendarEvents({
    campaignId: campId,
    orgId,
  });

  const { activities: dayCalendarEvents } = useDayCalendarEvents(
    focusDate.focusDate
  );

  function getIdsToSelect() {
    const eventsToSelect = new Set<number>();
    if (calendarStore.timeScale === 'month') {
      monthCalendarEvents
        .flatMap((event) => event.clusters)
        .flatMap((cluster) => cluster.events)
        .map((event) => event.id)
        .forEach((id) => eventsToSelect.add(id));
    } else if (calendarStore.timeScale === 'week') {
      weekCalendarEvents
        .flatMap((events) => events.lanes)
        .flatMap((lanes) => lanes)
        .flatMap((lane) => lane.events)
        .map((event) => event.id)
        .forEach((id) => eventsToSelect.add(id));
    } else if (calendarStore.timeScale === 'day') {
      dayCalendarEvents
        .flatMap((event) => event[1])
        .flatMap((e) => e.events)
        .map((e) => e.data.id)
        .forEach((id) => eventsToSelect.add(id));
    }
    return Array.from(eventsToSelect);
  }

  useEffect(() => {
    setVisibleEventIds(getIdsToSelect);
  }, [calendarStore.timeScale, calendarStore.focusDate]);

  return visibleEventIds;
}
