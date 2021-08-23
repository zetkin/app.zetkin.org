import { DateIOFormats } from '@date-io/core/IUtils';
import DayjsUtils from '@date-io/dayjs';
import dayjs, { Dayjs } from 'dayjs';

interface Opts {
    locale?: string;
    instance?: typeof dayjs;
    formats?: Partial<DateIOFormats>;
  }

  type Constructor<TDate extends Dayjs> = (
    ...args: Parameters<typeof dayjs>
  ) => TDate;

const withLocale = <TDate extends Dayjs>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dayjs: any,
    locale?: string,
): Constructor<TDate> => (!locale ? dayjs : (...args) => dayjs(...args).locale(locale));


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const JsonPlugin = (option: any, dayjsClass: any) => {
    // overriding existing API
    dayjsClass.prototype.toJSON = function() {
        return this.format();
    };
};
dayjs.extend(JsonPlugin);

const defaultFormats: DateIOFormats = {
    dayOfMonth: 'D',
    fullDate: 'll',
    fullDateTime: 'lll',
    fullDateTime12h: 'll hh:mm A',
    fullDateTime24h: 'll HH:mm',
    fullDateWithWeekday: 'dddd, LL',
    fullTime: 'LT',
    fullTime12h: 'hh:mm A',
    fullTime24h: 'HH:mm',
    hours12h: 'hh',
    hours24h: 'HH',
    keyboardDate: 'L',
    keyboardDateTime: 'L LT',
    keyboardDateTime12h: 'L hh:mm A',
    keyboardDateTime24h: 'L HH:mm',
    minutes: 'mm',
    month: 'MMMM',
    monthAndDate: 'MMMM D',
    monthAndYear: 'MMMM YYYY',
    monthShort: 'MMM',
    normalDate: 'D MMMM',
    normalDateWithWeekday: 'ddd, MMM D',
    seconds: 'ss',
    shortDate: 'MMM D',
    weekday: 'dddd',
    weekdayShort: 'ddd',
    year: 'YYYY',
};

class CustomDateUtils extends DayjsUtils {
    constructor(props: Opts) {
        super(props);
        const { locale, formats } = props;
        this.rawDayJsInstance = dayjs;
        this.dayjs = withLocale(this.rawDayJsInstance, locale);
        this.locale = locale;
        this.formats = Object.assign({}, defaultFormats, formats);
    }

    public formats: DateIOFormats;
    public rawDayJsInstance: typeof dayjs;
}

export default CustomDateUtils;
