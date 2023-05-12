import { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { isSameDate } from 'utils/dateUtils';
import useFilteredEventActivities from 'features/events/hooks/useFilteredEventActivities';
import useModel from 'core/useModel';
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
  campaignId,
  dates,
  orgId,
}: UseWeekCalendarEventsParams): UseWeekCalendarEventsReturn {
  const model = useModel((env) => new CampaignActivitiesModel(env, orgId));

  // TODO: Load only the ones necessary here
  const activities = model.getAllActivities(campaignId);
  const eventActivities = (activities.data?.filter(
    (activity) => activity.kind == ACTIVITIES.EVENT
  ) ?? []) as EventActivity[];

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
