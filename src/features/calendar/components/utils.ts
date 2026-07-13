import dayjs from 'dayjs';

import range from 'utils/range';
import { removeOffset } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import {
  ACTIVITIES,
  CampaignActivity,
  EventActivity,
} from 'features/campaigns/types';

export function isAllDay(start: string, end: string): boolean {
  const startDate = new Date(removeOffset(start));
  const endDate = new Date(removeOffset(end));

  // Check if the start and end dates are not on the same day
  if (startDate.toDateString() !== endDate.toDateString()) {
    // If start time and end time are 00:00:00 return true
    if (
      startDate.toString().split(' ')[4] == '00:00:00' &&
      endDate.toString().split(' ')[4] == '00:00:00'
    ) {
      return true;
    }
  }
  return false;
}

export type DaySummary = EventActivity[];

export type MultiDayEvent = ZetkinEvent & {
  originalEndTime: string;
  originalStartTime: string;
};

const endOfDay = (date: Temporal.PlainDateTime) =>
  date.with({ hour: 23, minute: 59, second: 59 });

const startOfDay = (date: Temporal.PlainDateTime) =>
  date.with({ hour: 0, minute: 0, second: 0 });

export const getActivitiesByDay = (
  activities: CampaignActivity[]
): Record<string, DaySummary> => {
  const dateHashmap: Record<string, DaySummary> = {};
  const applyToHashmap = (date: Temporal.PlainDate, event: EventActivity) => {
    const key = date.toString();
    dateHashmap[key] = [...(dateHashmap[key] ?? []), event];
  };

  // Events
  activities
    .filter((activity) => activity.kind === ACTIVITIES.EVENT)
    .forEach((event: EventActivity) => {
      const startTime = Temporal.PlainDateTime.from(event.data.start_time);
      const endTime = Temporal.PlainDateTime.from(event.data.end_time);
      const startDate = startTime.toPlainDate();
      const endDate = endTime.toPlainDate();
      // If single day event
      if (startDate.equals(endDate)) {
        applyToHashmap(startDate, event);
      } else {
        // If multi day event
        const eventDays = startDate.until(endDate).total('days') + 1;

        // Multi day events are added to each date they span.
        // The first day goes from the start time to 24:00
        // Complete days in the middle go from 00:00 - 24:00
        // The last day goes from 00:00 - the end time
        range(eventDays).forEach((dayIndex) => {
          const dayOfEvent = startTime.add({ days: dayIndex });

          const modifiedEvent = {
            ...event,
            data: {
              ...event.data,
              originalEndTime: event.data.end_time,
              originalStartTime: event.data.start_time,
              ...(() => {
                // First day of multi day event
                if (dayIndex === 0) {
                  return {
                    end_time: endOfDay(dayOfEvent).toString(),
                  };
                }
                // Final day of multi day event
                if (dayIndex === eventDays - 1) {
                  return {
                    start_time: startOfDay(dayOfEvent).toString(),
                  };
                }
                // Day between start and end
                return {
                  end_time: endOfDay(dayOfEvent).toString(),
                  start_time: startOfDay(dayOfEvent).toString(),
                };
              })(),
            },
          };
          applyToHashmap(dayOfEvent.toPlainDate(), modifiedEvent);
        });
      }
    });
  return dateHashmap;
};

export type DSTChange = 'summertime' | 'wintertime';
export function getDstChangeAtDate(
  date: dayjs.Dayjs | Temporal.PlainDate
): DSTChange | undefined {
  if (date instanceof Temporal.PlainDate) {
    const { hoursInDay } = date.toZonedDateTime(Temporal.Now.timeZoneId());
    if (hoursInDay === 23) {
      return 'summertime';
    }
    if (hoursInDay === 25) {
      return 'wintertime';
    }
    return undefined;
  }
  const change =
    getTimezoneAtDate(date.startOf('day')) -
    getTimezoneAtDate(date.endOf('day'));
  if (change === 0) {
    return undefined;
  }
  return change > 0 ? 'wintertime' : 'summertime';
}

export function getTimezoneAtDate(date: dayjs.Dayjs): number {
  const jan = new Date(date.get('year'), 0, 1).getTimezoneOffset();
  const jul = new Date(date.get('year'), 6, 1).getTimezoneOffset();
  return (date.utcOffset() - Math.max(jan, jul)) / 60;
}
