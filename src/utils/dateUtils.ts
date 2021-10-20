import { Dayjs } from 'dayjs';

import { ZetkinEvent } from 'types/zetkin';


export const getNewDateWithOffset = (date: Date, offset: number ):Date => {
    return new Date(new Date(date).setDate(date.getDate() + offset));
};

/**
 * Returns the first and last object in an array of ZetkinEvents.
 *
 * This function works like this becuase the events will arrive from the
 * server already sorted chronologically by start_time.
 */
export const getFirstAndLastEvent = (campaignEvents: ZetkinEvent[]): (ZetkinEvent | undefined)[] => {
    const firstEvent = campaignEvents.length ? campaignEvents[0] : undefined;
    const lastEvent = firstEvent? campaignEvents[campaignEvents.length - 1] : undefined;
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
export const LocalTimeToJsonPlugin = (options: never, dayjsClass: typeof Dayjs): void => {
    dayjsClass.prototype.toJSON = function() {
        return this.format('YYYY-MM-DDTHH:mm:ss');
    };
};
