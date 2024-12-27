import dayjs, { Dayjs } from 'dayjs';

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
 *
 * ```typescript
 * removeOffset("2000-01-01 00:00:00+00:00") // "2000-01-01 00:00:00"
 * ```
 *
 * @category Time
 * @param {string} datetime ISO datetime string with +00:00 offset
 * @return {string} ISO datetime string without the +00:00 offset
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
 * @param date
 * @returns string in YYYY-MM-DD format
 */
export function makeNaiveDateString(date: Date): string {
  const month = date.getMonth() + 1;
  return `${date.getFullYear().toString()}-${month
    .toString()
    .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

/**
 * @param date
 * @returns string in HH:MM format
 */
export function makeNaiveTimeString(date: Date): string {
  return `${date.getHours().toString().padStart(2, '0')}:${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Takes an ISO datestring and returns a boolean that says if the date is in the futre or not.
 * @param datestring
 * @returns boolean
 */
export function isInFuture(datestring: string): boolean {
  const now = new Date();
  const date = new Date(datestring);

  return date > now;
}

export function isSameDate(first: Date, second: Date): boolean {
  return dayjs(first).isSame(dayjs(second), 'day');
}

export function isValidDate(date: Date): boolean {
  if (date && !isNaN(date.getTime())) {
    return true;
  } else {
    return false;
  }
}

export function dateIsAfter(first: Date, second: Date): boolean {
  return first.toISOString().slice(0, 10) < second.toISOString().slice(0, 10);
}

export function dateIsBefore(first: Date, second: Date): boolean {
  return first.toISOString().slice(0, 10) > second.toISOString().slice(0, 10);
}

export function getUTCDateWithoutTime(
  naiveDateString: string | null
): Date | null {
  if (!naiveDateString) {
    return null;
  }

  const dateFromNaive = new Date(naiveDateString);
  const utcTime = Date.UTC(
    dateFromNaive.getFullYear(),
    dateFromNaive.getMonth(),
    dateFromNaive.getDate()
  );

  return new Date(utcTime);
}

export function getOffset(dateString: string) {
  const offsetRegex = /[+-]\d{2}:\d{2}$/;
  const offset = dateString.match(offsetRegex);
  return offset ? offset[0] : null;
}
