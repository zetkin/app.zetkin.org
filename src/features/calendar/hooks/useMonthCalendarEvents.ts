import dayjs from 'dayjs';

import { AnyClusteredEvent } from '../utils/clusterEventsForWeekCalender';
import { getActivitiesByDay } from '../components/utils';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useFilteredEventActivities from 'features/events/hooks/useFilteredEventActivities';
import { useNumericRouteParams } from 'core/hooks';
import {
  CLUSTER_TYPE,
  clusterEvents,
} from 'features/campaigns/hooks/useClusteredActivities';

type UseMonthCalendarEventsParams = {
  campaignId?: number;
  endDate: Date;
  maxPerDay: number;
  orgId: number;
  startDate: Date;
};

type UseMonthCalendarEventsReturn = {
  clusters: AnyClusteredEvent[];
  date: Date;
}[];

export default function useMonthCalendarEvents({
  endDate,
  maxPerDay,
  startDate,
}: UseMonthCalendarEventsParams): UseMonthCalendarEventsReturn {
  const { campId, orgId } = useNumericRouteParams();
  const eventActivities = useEventsFromDateRange(
    startDate,
    endDate,
    orgId,
    campId
  );

  // Filter events based on user filters
  const filteredActivities = useFilteredEventActivities(eventActivities);

  // Hashmap where the key is a date and the value is all the activities on that day
  const datesWithActivities = getActivitiesByDay(filteredActivities);

  const dates: UseMonthCalendarEventsReturn = [];

  const curDate = new Date(startDate);
  while (curDate.getTime() <= endDate.getTime()) {
    const activitiesOnCurrentDay =
      datesWithActivities[dayjs(curDate).format('YYYY-MM-DD')]?.events || [];

    const clusters: AnyClusteredEvent[] = [
      ...clusterEvents(activitiesOnCurrentDay),
    ];

    // If the number of clusters N is bigger than the maximum number M
    // allowed per day, take the last N-M clusters and squash them into a
    // single big arbitrary cluster at the end.
    const maxPerDayButAtLeastOne = Math.max(1, maxPerDay);
    while (clusters.length > maxPerDayButAtLeastOne) {
      const clusterToRemove = clusters.pop();
      const clusterToReplace = clusters.pop();

      // Merge the two and push back onto array as arbitrary cluster
      clusters.push({
        events: [
          ...(clusterToReplace?.events ?? []),
          ...(clusterToRemove?.events ?? []),
        ],
        kind: CLUSTER_TYPE.ARBITRARY,
      });
    }

    dates.push({
      clusters,
      date: new Date(curDate),
    });

    curDate.setDate(curDate.getDate() + 1);
  }

  return dates;
}
