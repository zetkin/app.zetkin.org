import { useSelector } from 'react-redux';
import { useState } from 'react';

import { RootState } from 'core/store';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { DaySummary, getActivitiesByDay } from '../components/utils';

type UseDayCalendarEventsReturn = {
  activities: [Date, DaySummary][];
  isLoadingFuture: boolean;
  isLoadingPast: boolean;
  loadMoreFuture: () => void;
  loadMorePast: () => void;
  previousActivityDay: [Date, DaySummary] | null;
};

export default function useDayCalendarEvents(
  focusDate: Date
): UseDayCalendarEventsReturn {
  const [firstDate, setFirstDate] = useState(focusDate);
  const [lastDate, setLastDate] = useState(
    new Date(
      focusDate.getUTCFullYear(),
      focusDate.getUTCMonth(),
      focusDate.getUTCDate() + 30
    )
  );

  const eventsState = useSelector((state: RootState) => state.events);

  const activities = useEventsFromDateRange(firstDate, lastDate);
  const activitiesByDay = getActivitiesByDay(activities);

  const lastDateInStore =
    eventsState.eventsByDate[lastDate.toISOString().slice(0, 10)];

  return {
    activities: Object.entries(activitiesByDay).map(([dateStr, daySummary]) => [
      new Date(dateStr),
      daySummary,
    ]),
    isLoadingFuture: !lastDateInStore || lastDateInStore.isLoading,
    isLoadingPast: false, // TODO: Implement
    loadMoreFuture: () => {
      const newLastDate = new Date(lastDate);
      newLastDate.setDate(newLastDate.getDate() + 30);
      setLastDate(newLastDate);
    },
    loadMorePast: () => {
      // TODO: Implement
      setFirstDate;
    },
    previousActivityDay: null, // TODO: Implement
  };
}
