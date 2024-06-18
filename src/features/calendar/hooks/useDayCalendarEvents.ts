import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import getNextEventDay from 'features/events/rpc/getNextEventDay';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useFilteredEventActivities from 'features/events/hooks/useFilteredEventActivities';
import { DaySummary, getActivitiesByDay } from '../components/utils';
import {
  useApiClient,
  useAppSelector,
  useNumericRouteParams,
} from 'core/hooks';

type UseDayCalendarEventsReturn = {
  activities: [Date, DaySummary][];
  hasMore: boolean;
  isLoadingFuture: boolean;
  loadMoreFuture: () => void;
  previousActivityDay: [Date, DaySummary] | null;
};

export default function useDayCalendarEvents(
  focusDate: Date
): UseDayCalendarEventsReturn {
  const [nextLastDate, setNextLastDate] = useState<Date | null>(null);
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

  // When a new lastDate is set, load the next last date
  const { orgId, campId } = useNumericRouteParams();
  const apiClient = useApiClient();
  useEffect(() => {
    async function loadNextLastDate() {
      const afterDate = new Date(lastDate);
      afterDate.setDate(afterDate.getDate() + 1);
      const nextLastDateStr = await apiClient.rpc(getNextEventDay, {
        afterDate: afterDate.toISOString(),
        campaignId: campId,
        orgId,
      });

      setNextLastDate(nextLastDateStr ? new Date(nextLastDateStr) : null);
    }
    loadNextLastDate();
  }, [lastDate.toISOString()]);

  const eventsState = useAppSelector((state) => state.events);

  // When user navigates very far in the future (e.g. by changing the year)
  // the focusDate may end up being _after_ the lastDate, which will cause
  // errors if allowed. Instead, use the focusDate as endDate before loading,
  // and the useEffect() above will soon update the lastDate.
  const lastDateToLoad = lastDate > focusDate ? lastDate : focusDate;

  const activities = useEventsFromDateRange(
    focusDate,
    lastDateToLoad,
    orgId,
    campId
  );
  const filtered = useFilteredEventActivities(activities);
  const activitiesByDay = getActivitiesByDay(filtered);

  const lastDateInStore =
    eventsState.eventsByDate[lastDate.toISOString().slice(0, 10)];

  return {
    activities: Object.entries(activitiesByDay).map(([dateStr, daySummary]) => [
      new Date(dateStr),
      daySummary,
    ]),
    hasMore: !!nextLastDate,
    isLoadingFuture: !lastDateInStore || lastDateInStore.isLoading,
    loadMoreFuture: () => {
      if (nextLastDate) {
        setLastDate(nextLastDate);
      }
    },
    previousActivityDay: null, // TODO: Implement
  };
}
