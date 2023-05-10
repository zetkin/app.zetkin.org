import { ACTIVITIES } from 'features/campaigns/models/CampaignActivitiesModel';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import { EventActivity } from 'features/campaigns/models/CampaignActivitiesModel';
import { isSameDate } from 'utils/dateUtils';
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

  return dates.map((date) => {
    const relevantActivities = eventActivities.filter((activity) =>
      isSameDate(new Date(activity.data.start_time), date)
    );

    const lanes = clusterEventsForWeekCalender(relevantActivities);

    return {
      date,
      lanes,
    };
  });
}
