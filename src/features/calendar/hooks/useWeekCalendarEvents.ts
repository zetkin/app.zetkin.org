import { getActivitiesByDay } from '../components/utils';
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

  const datesWithActivities = getActivitiesByDay(filteredActivities);

  return dates.map((date) => {
    const activitiesToday =
      datesWithActivities[date.toISOString().slice(0, 10)]?.events || [];

    const lanes = clusterEventsForWeekCalender(activitiesToday);

    return {
      date,
      lanes,
    };
  });
}
