import dayjs, { Dayjs } from 'dayjs';

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

/**
 * Loops through activities and if an event with any date before the provided date
 * is found, returns the date nearest to the provided date. If no date is found,
 * returns `null`.
 */
export const getPreviousDayWithActivities = (
  activities: CampaignActivity[],
  target: Date
): Date | null => {
  const previousDay = activities.reduce((lastDate: Date | null, activity) => {
    const startDate = dayjs(activity.startDate);
    const endDate = dayjs(activity.endDate);
    const targetDate = dayjs(target);

    const datesBeforeTarget = [startDate, endDate].filter((date) =>
      // Need to improve this so it counts the date as before midnight of the target day
      date.isBefore(targetDate.add(1, 'day'))
    );

    // Out of the activity dates which are before the target, return the date nearest the target
    const closestDate = datesBeforeTarget.reduce(
      (closest: Dayjs | undefined, date) => {
        if (date.isAfter(closest)) {
          return date;
        }
        return closest;
      },
      datesBeforeTarget[0]
    );

    if (closestDate) {
      if (!lastDate || closestDate.isAfter(lastDate)) {
        // Sets this as the lastdate
        return closestDate.toDate();
      }
    }

    return lastDate;
  }, null);
  return previousDay;
};
