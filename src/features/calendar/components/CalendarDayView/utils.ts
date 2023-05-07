/* eslint-disable @typescript-eslint/ban-ts-comment */
import dayjs, { Dayjs } from 'dayjs';

import { NonEventActivity } from 'features/campaigns/hooks/useClusteredActivities';
import {
  ACTIVITIES,
  CampaignActivity,
  EventActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

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

    const datesBeforeTarget = [startDate, endDate].filter(
      (date) => !date.isSame(targetDate, 'day') && date.isBefore(targetDate)
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

const makeIsoDateString = (date: Date): string | null => {
  try {
    return date.toISOString().slice(0, 10);
  } catch {
    return null;
  }
};

export interface DaySummary {
  endingActivities: NonEventActivity[];
  events: EventActivity[] | never[];
  startingActivities: NonEventActivity[];
}

export const getActivitiesByDate = (
  activities: CampaignActivity[]
): Record<string, DaySummary> => {
  const dateHashmap: Record<string, DaySummary> = {};

  // Events
  activities
    .filter((activity) => activity.kind === ACTIVITIES.EVENT)
    .forEach(
      // @ts-ignore
      (event: EventActivity) => {
        const startTime = dayjs(event.data.start_time);
        const isoDateString = makeIsoDateString(startTime.toDate());
        const endTime = dayjs(event.data.end_time);
        if (isoDateString) {
          // If single day event
          if (startTime.isSame(endTime, 'day')) {
            // If date already in hashmap
            if (isoDateString in dateHashmap) {
              const targetDate = dateHashmap[isoDateString];
              dateHashmap[isoDateString] = {
                ...targetDate,
                events: [...targetDate.events, event],
              };
            } else {
              // If date not yet in hashmap
              dateHashmap[isoDateString] = {
                endingActivities: [],
                events: [event],
                startingActivities: [],
              };
            }
          }
        }
      }
    );

  // Non events
  activities
    .filter((event) => event.kind !== ACTIVITIES.EVENT)
    .forEach(
      // @ts-ignore
      (activity: NonEventActivity) => {
        const startTime = dayjs(activity.startDate);
        const startTimeIsoDateString = makeIsoDateString(startTime.toDate());
        const endTime = dayjs(activity.endDate);
        const endTimeIsoDateString = makeIsoDateString(endTime.toDate());

        // Assign activity start time to date hashmap
        if (startTimeIsoDateString) {
          if (startTimeIsoDateString in dateHashmap) {
            const startTimeTargetDate = dateHashmap[startTimeIsoDateString];
            dateHashmap[startTimeIsoDateString] = {
              ...startTimeTargetDate,
              startingActivities: [
                ...startTimeTargetDate.startingActivities,
                activity,
              ],
            };
          } else {
            dateHashmap[startTimeIsoDateString] = {
              endingActivities: [],
              events: [],
              startingActivities: [activity],
            };
          }
        }

        // Assign activity end time to date hashmap
        if (endTimeIsoDateString) {
          if (endTimeIsoDateString in dateHashmap) {
            const endTimeTargetDate = dateHashmap[endTimeIsoDateString];
            dateHashmap[endTimeIsoDateString] = {
              ...endTimeTargetDate,
              startingActivities: [
                ...endTimeTargetDate.startingActivities,
                activity,
              ],
            };
          } else {
            dateHashmap[endTimeIsoDateString] = {
              endingActivities: [activity],
              events: [],
              startingActivities: [],
            };
          }
        }
      }
    );

  return dateHashmap;
};
