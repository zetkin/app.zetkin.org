/* eslint-disable @typescript-eslint/ban-ts-comment */
import dayjs from 'dayjs';

import { NonEventActivity } from 'features/campaigns/hooks/useClusteredActivities';
import {
  ACTIVITIES,
  CampaignActivity,
  EventActivity,
} from 'features/campaigns/models/CampaignActivitiesModel';

const makeIsoDateString = (date: Date): string | null => {
  try {
    return date.toISOString().slice(0, 10);
  } catch {
    return null;
  }
};

export const getFutureDays = (
  activitiesHashMap: Record<string, DaySummary>,
  targetDate: Date
): [string, DaySummary][] => {
  return Object.entries(activitiesHashMap).filter(([dateString]) => {
    const activityDay = dayjs(dateString);
    return (
      activityDay.isSame(targetDate, 'day') || activityDay.isAfter(targetDate)
    );
  });
};

export const getPreviousDay = (
  activities: Record<string, DaySummary>,
  target: Date
): [Date, DaySummary] | null => {
  const dates = Object.keys(activities).map(
    (dateString) => new Date(dateString)
  );
  const datesBeforeTarget = dates.filter(
    (date) => !dayjs(date).isSame(target, 'day') && dayjs(date).isBefore(target)
  );

  const closestDateBeforeTarget = datesBeforeTarget.reduce(
    (previousClosestDate: Date | undefined, date) => {
      if (dayjs(date).isAfter(previousClosestDate)) {
        return date;
      }
      return previousClosestDate;
    },
    datesBeforeTarget[0]
  );

  const closestDateIsoString =
    closestDateBeforeTarget && makeIsoDateString(closestDateBeforeTarget);

  if (closestDateIsoString) {
    return [closestDateBeforeTarget, activities[closestDateIsoString]];
  }

  return null;
};

export interface DaySummary {
  endingActivities: NonEventActivity[];
  events: EventActivity[] | never[];
  startingActivities: NonEventActivity[];
}

export const getActivitiesByDay = (
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
  // activities
  //   .filter((event) => event.kind !== ACTIVITIES.EVENT)
  //   .forEach(
  //     // @ts-ignore
  //     (activity: NonEventActivity) => {
  //       const startTime = dayjs(activity.startDate);
  //       const startTimeIsoDateString = makeIsoDateString(startTime.toDate());
  //       const endTime = dayjs(activity.endDate);
  //       const endTimeIsoDateString = makeIsoDateString(endTime.toDate());

  //       // Assign activity start time to date hashmap
  //       if (startTimeIsoDateString) {
  //         if (startTimeIsoDateString in dateHashmap) {
  //           const startTimeTargetDate = dateHashmap[startTimeIsoDateString];
  //           dateHashmap[startTimeIsoDateString] = {
  //             ...startTimeTargetDate,
  //             startingActivities: [
  //               ...startTimeTargetDate.startingActivities,
  //               activity,
  //             ],
  //           };
  //         } else {
  //           dateHashmap[startTimeIsoDateString] = {
  //             endingActivities: [],
  //             events: [],
  //             startingActivities: [activity],
  //           };
  //         }
  //       }

  //       // Assign activity end time to date hashmap
  //       if (endTimeIsoDateString) {
  //         if (endTimeIsoDateString in dateHashmap) {
  //           const endTimeTargetDate = dateHashmap[endTimeIsoDateString];
  //           dateHashmap[endTimeIsoDateString] = {
  //             ...endTimeTargetDate,
  //             startingActivities: [
  //               ...endTimeTargetDate.startingActivities,
  //               activity,
  //             ],
  //           };
  //         } else {
  //           dateHashmap[endTimeIsoDateString] = {
  //             endingActivities: [activity],
  //             events: [],
  //             startingActivities: [],
  //           };
  //         }
  //       }
  //     }
  //   );

  return dateHashmap;
};
