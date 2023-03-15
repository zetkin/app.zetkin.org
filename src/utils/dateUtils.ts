import dayjs, { Dayjs } from 'dayjs';

import {
  ACTIVITIES,
  CampaignAcitivity,
} from 'features/campaigns/models/CampaignAcitivitiesModel';

import { ZetkinEvent } from 'utils/types/zetkin';

export const getNewDateWithOffset = (date: Date, offset: number): Date => {
  return new Date(new Date(date).setDate(date.getDate() + offset));
};

/**
 * Returns the first and last object in an array of ZetkinEvents.
 *
 * This function sorts the events by start_time and returns the first and last one.
 */
export const getFirstAndLastEvent = (
  campaignEvents: ZetkinEvent[]
): (ZetkinEvent | undefined)[] => {
  const sortedCampaignEvents = campaignEvents.sort((a, b) =>
    dayjs(a.start_time).diff(dayjs(b.start_time))
  );
  const firstEvent = sortedCampaignEvents.length
    ? campaignEvents[0]
    : undefined;
  const lastEvent = firstEvent
    ? campaignEvents[campaignEvents.length - 1]
    : undefined;
  return [firstEvent, lastEvent];
};

/**
 * Removes the offset part of an ISO datetime string.
 *
 * This is needed because event objects send an offset of +00:00 (UTC Time) from the server.
 * It is not needed if the datetime string coming from the server doesn't contain an offset.
 */
export const removeOffset = (datetime: string): string => {
  return datetime.split('+')[0];
};

/**
 * Plugin for dayjs which overrides default `dayjs.toJson()` method to return an ISO
 * datetime string which uses the local time.
 *
 * Default behaviour returns an ISO datetime string in UTC time.
 */
export const LocalTimeToJsonPlugin = (
  options: never,
  dayjsClass: typeof Dayjs
): void => {
  dayjsClass.prototype.toJSON = function () {
    return this.format('YYYY-MM-DDTHH:mm:ss');
  };
};

/**
 * Takes a CampaignActivity and returns its start date as a Date object, or
 * null if the start date is unset.
 * @param activity
 * @returns Date | null
 */
export function getStartDate(activity: CampaignAcitivity): Date | null {
  if (activity.kind === ACTIVITIES.SURVEY) {
    if (!activity.published) {
      return null;
    }
    return new Date(activity.published);
  } else if (activity.kind === ACTIVITIES.CALL_ASSIGNMENT) {
    if (!activity.start_date) {
      return null;
    }
    return new Date(activity.start_date);
  } else {
    if (!activity.published) {
      return null;
    }
    return new Date(activity.published);
  }
}

/**
 * Takes an ISO datestring and checks if it is in the future.
 * @param datestring
 * @returns boolean
 */
export function isInFuture(datestring: string): boolean {
  const now = new Date();
  const date = new Date(datestring);

  return date > now;
}
