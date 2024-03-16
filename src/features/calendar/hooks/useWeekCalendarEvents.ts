import { isSameDate } from 'utils/dateUtils';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import useFilteredEventActivities from 'features/events/hooks/useFilteredEventActivities';
import clusterEventsForWeekCalender, {
  AnyClusteredEvent,
} from '../utils/clusterEventsForWeekCalender';

type UseWeekCalendarEventsParams = {
  campaignId?: number;
  dates: Date[];
  orgId: number;
};

type UseWeekCalendarEventsReturn = {
  date: Date;
  lanes: AnyClusteredEvent[][];
}[];

export default function useWeekCalendarEvents({
  dates,
}: UseWeekCalendarEventsParams): UseWeekCalendarEventsReturn {
  const eventActivities = useEventsFromDateRange(
    dates[0],
    dates[dates.length - 1]
  );
  const filteredActivities = useFilteredEventActivities(eventActivities);

  return dates.map((date) => {
    const relevantActivities = filteredActivities.filter((activity) =>
      isSameDate(new Date(activity.data.start_time), date)
    );

    const lanes = clusterEventsForWeekCalender(relevantActivities);

    return {
      date,
      lanes,
    };
  });
}
