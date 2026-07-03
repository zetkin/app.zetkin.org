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
  activities: [Temporal.PlainDate, DaySummary][];
  hasMore: boolean;
  isLoadingFuture: boolean;
  loadMoreFuture: () => void;
  previousActivityDay: [Date, DaySummary] | null;
};

export default function useDayCalendarEvents(
  focusDate: Temporal.PlainDate
): UseDayCalendarEventsReturn {
  const [nextLastDate, setNextLastDate] = useState<Temporal.PlainDate | null>(
    null
  );
  const [lastDate, setLastDate] = useState(focusDate.add({ days: 30 }));

  // When focus date changes make sure lastDate is at least
  // 30 days in the future, or more will need to load.
  useEffect(() => {
    if (lastDate.until(focusDate).total('days') < 30) {
      setLastDate(focusDate.add({ days: 30 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusDate]);

  // When a new lastDate is set, load the next last date
  const { orgId, campId } = useNumericRouteParams();
  const apiClient = useApiClient();
  useEffect(() => {
    async function loadNextLastDate() {
      const afterDate = lastDate.add({ days: 1 });
      const nextLastDateStr = await apiClient.rpc(getNextEventDay, {
        afterDate: afterDate.toString(),
        campaignId: campId,
        orgId,
      });

      setNextLastDate(
        nextLastDateStr ? Temporal.PlainDate.from(nextLastDateStr) : null
      );
    }
    loadNextLastDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastDate]);

  const eventsState = useAppSelector((state) => state.events);

  // When user navigates very far in the future (e.g. by changing the year)
  // the focusDate may end up being _after_ the lastDate, which will cause
  // errors if allowed. Instead, use the focusDate as endDate before loading,
  // and the useEffect() above will soon update the lastDate.
  const lastDateToLoad =
    Temporal.PlainDate.compare(lastDate, focusDate) < 1 ? lastDate : focusDate;

  const activities = useEventsFromDateRange(
    focusDate,
    lastDateToLoad,
    orgId,
    campId
  );
  const filtered = useFilteredEventActivities(activities);
  const activitiesByDay = getActivitiesByDay(filtered);

  const lastDateInStore = eventsState.eventsByDate[lastDate.toString()];

  return {
    activities: Object.entries(activitiesByDay).map(([dateStr, daySummary]) => [
      Temporal.PlainDate.from(dateStr),
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
