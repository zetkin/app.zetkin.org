import { DayInfo } from './types';
import {
  ACTIVITIES,
  CampaignActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

const groupActivitiesByDate = (activities: CampaignActivity[]) => {
  // Group all by date
  const activitiesByDate: { [key: string]: DayInfo } = {};
  for (let i = 0; i < activities.length; i++) {
    const activity = activities[i];
    if (activity.kind == ACTIVITIES.EVENT) {
      const dateString = new Date(activity.data.start_time)
        .toISOString()
        .slice(0, 10);
      if (!(dateString in activitiesByDate)) {
        activitiesByDate[dateString] = {
          activities_ends: [],
          activities_starts: [],
          events: [],
        };
      }

      activitiesByDate[dateString].events.push(activity.data);
    } else {
      if (activity.startDate != null) {
        const dateString = new Date(activity.startDate)
          .toISOString()
          .slice(0, 10);
        if (!(dateString in activitiesByDate)) {
          activitiesByDate[dateString] = {
            activities_ends: [],
            activities_starts: [],
            events: [],
          };
        }
        activitiesByDate[dateString].activities_starts.push(activity);
      }
      if (activity.endDate != null) {
        const dateString = new Date(activity.endDate)
          .toISOString()
          .slice(0, 10);
        if (!(dateString in activitiesByDate)) {
          activitiesByDate[dateString] = {
            activities_ends: [],
            activities_starts: [],
            events: [],
          };
        }
        activitiesByDate[dateString].activities_ends.push(activity);
      }
    }
  }

  return activitiesByDate;
};

export default groupActivitiesByDate;
