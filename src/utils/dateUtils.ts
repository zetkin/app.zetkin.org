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
 * Plugin for DayJs which overrides default `dayjs.toJson()` method to return an ISO
 * datetime which uses the local time.
 *
 * Default behaviour returns UTC time.
 */
export const LocalTimeToJsonPlugin = (option: unknown, dayjsClass: typeof Dayjs): void => {
    dayjsClass.prototype.toJSON = function() {
        return this.format('YYYY-MM-DDTHH:mm:ss');
    };
};
