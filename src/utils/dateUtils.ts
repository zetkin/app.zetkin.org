import { Dayjs } from 'dayjs';

export const getNaiveDate = (dateString: string): Date => {
    const date = new Date(dateString);
    return new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
    );
};

export const getNewDateWithOffset = (date: Date, offset: number ):Date => {
    return new Date(new Date(date).setDate(date.getDate() + offset));
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
