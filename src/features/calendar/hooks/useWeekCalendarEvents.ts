import { partition } from 'lodash';

import { dateIsAfter, isSameDate, dateIsBefore } from 'utils/dateUtils';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useFilteredEventActivities from 'features/events/hooks/useFilteredEventActivities';
import clusterEventsForWeekCalender, {
  AnyClusteredEvent,
} from '../utils/clusterEventsForWeekCalender';

type UseWeekCalendarEventsParams = {
  campaignId: number;
  dates: Date[];
  orgId: number;
};

type UseWeekCalendarEventsReturn = {
  date: Date;
  lanes: AnyClusteredEvent[][];
  multidayEvents: AnyClusteredEvent[][];
}[];

export default function useWeekCalendarEvents({
  campaignId,
  dates,
  orgId,
}: UseWeekCalendarEventsParams): UseWeekCalendarEventsReturn {
  const eventActivities = useEventsFromDateRange(
    dates[0],
    dates[dates.length - 1],
    orgId,
    campaignId
  );
  const filteredActivities = useFilteredEventActivities(eventActivities);

  return dates.map((date) => {
    const relevantActivities = filteredActivities
      .filter((activity) => {
        const start = new Date(activity.data.start_time);
        const end = new Date(activity.data.end_time);
        return (
          isSameDate(start, date) ||
          isSameDate(end, date) ||
          (dateIsAfter(start, date) && dateIsBefore(end, date))
        );
      })
      .map((activity) => ({
        activity,
        isMultipleDays: !isSameDate(
          new Date(activity.data.start_time),
          new Date(activity.data.end_time)
        ),
      }));

    const [multidayActivities, singleDayActivities] = partition(
      relevantActivities,
      (activity) => activity.isMultipleDays
    ).map((l) => l.map((act) => act.activity));

    const lanes = clusterEventsForWeekCalender(singleDayActivities);
    const multidayEvents = clusterEventsForWeekCalender(multidayActivities);
    return {
      date,
      lanes,
      multidayEvents,
    };
  });
}
