import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { RootState } from 'core/store';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useFilteredEventActivities from 'features/events/hooks/useFilteredEventActivities';
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

  // When focus date changes make sure lastDate is at least
  // 30 days in the future, or more will need to load.
  useEffect(() => {
    if (dayjs(lastDate).diff(focusDate, 'day') < 30) {
      const newLastDate = new Date(focusDate);
      newLastDate.setDate(newLastDate.getDate() + 30);

      setLastDate(newLastDate);
    }
  }, [focusDate.toISOString()]);

  const eventsState = useSelector((state: RootState) => state.events);

  const activities = useEventsFromDateRange(focusDate, lastDate);
  const filtered = useFilteredEventActivities(activities);
  const activitiesByDay = getActivitiesByDay(filtered);

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
