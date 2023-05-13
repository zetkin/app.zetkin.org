import { useSelector } from 'react-redux';
import { useState } from 'react';

import { RootState } from 'core/store';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { DaySummary, getActivitiesByDay } from '../components/utils';

type UseDayCalendarEventsReturn = {
  activities: [Date, DaySummary][];
  isLoadingFuture: boolean;
  loadMoreFuture: () => void;
  previousActivityDay: [Date, DaySummary] | null;
};

export default function useDayCalendarEvents(
  focusDate: Date
): UseDayCalendarEventsReturn {
  const [lastDate, setLastDate] = useState(
    new Date(
      focusDate.getUTCFullYear(),
      focusDate.getUTCMonth(),
      focusDate.getUTCDate() + 30
    )
  );

  const eventsState = useSelector((state: RootState) => state.events);

  const activities = useEventsFromDateRange(focusDate, lastDate);
  const activitiesByDay = getActivitiesByDay(activities);

  const lastDateInStore =
    eventsState.eventsByDate[lastDate.toISOString().slice(0, 10)];

  return {
    activities: Object.entries(activitiesByDay).map(([dateStr, daySummary]) => [
      new Date(dateStr),
      daySummary,
    ]),
    isLoadingFuture: !lastDateInStore || lastDateInStore.isLoading,
    loadMoreFuture: () => {
      const newLastDate = new Date(lastDate);
      newLastDate.setDate(newLastDate.getDate() + 30);
      setLastDate(newLastDate);
    },
    previousActivityDay: null, // TODO: Implement
  };
}
