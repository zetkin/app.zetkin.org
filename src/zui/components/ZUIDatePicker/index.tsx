import { Dayjs } from 'dayjs';
import { FC } from 'react';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import {
  DateRange,
  DateRangeCalendar,
  DateRangePickerDay,
  PickersDay,
} from '@mui/x-date-pickers-pro';

type DatePickerBaseProps = {
  /**
   * Calendar will display a dot under each date
   * in this array.
   */
  datesToMark?: Dayjs[];

  /**
   * If true, user cannot select dates before the
   * date on the client.
   *
   * Defaults to "false".
   */
  disablePast?: boolean;
};

type ValueProps<TValue, TAllowRangeSelection> = {
  /**
   * If true, value must be a DateRange<Dayjs>, and
   * user can select a range between two dates.
   */
  allowRangeSelection: TAllowRangeSelection;

  /**
   * The function that runs when a date is selected.
   */
  onChange: (newValue: TValue) => void;

  /**
   * The value of the calendar.
   */
  value: TValue;
};

export type ZUIDatePickerProps = DatePickerBaseProps &
  (ValueProps<DateRange<Dayjs>, true> | ValueProps<Dayjs | null, false>);

const ZUIDatePicker: FC<ZUIDatePickerProps> = ({
  datesToMark = [],
  disablePast = false,
  onChange,
  value,
  allowRangeSelection,
}) => {
  if (allowRangeSelection) {
    return (
      <DateRangeCalendar
        calendars={1}
        disablePast={disablePast}
        onChange={(newDateRange) => onChange(newDateRange)}
        slots={{
          day: (props) => {
            const day = props.day;

            const hasDateToMark = datesToMark.find((date) =>
              date.isSame(day, 'date')
            );

            const showMark = hasDateToMark && !props.outsideCurrentMonth;

            return (
              <DateRangePickerDay
                {...props}
                sx={(theme) => ({
                  '& .MuiDateRangePickerDay-day::before': showMark
                    ? {
                        backgroundColor: props.selected
                          ? theme.palette.common.white
                          : theme.palette.primary.main,
                        borderRadius: '1em',
                        bottom: '0.25rem',
                        content: '""',
                        height: '0.313rem',
                        position: 'absolute',
                        width: '0.313rem',
                      }
                    : '',
                })}
              />
            );
          },
        }}
        sx={(theme) => ({
          '& .MuiDayCalendar-header': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.813rem',
            fontWeight: 500,
            letterSpacing: '0.025rem',
            lineHeight: '1.349rem',
          },
          '& .MuiPickersArrowSwitcher-root svg': {
            color: theme.palette.primary.main,
          },
          '& .MuiPickersCalendarHeader-label': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '0.009rem',
            lineHeight: '1.5rem',
          },
          '& .MuiPickersCalendarHeader-switchViewIcon': {
            color: theme.palette.primary.main,
          },
          '& .MuiPickersDay-root': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.009rem',
            lineHeight: '1.313rem',
          },
          '& .MuiPickersYear-yearButton': {
            fontFamily: theme.typography.fontFamily,
          },
          flexDirection: 'column',
          height: '21rem',
          margin: '0 auto',
          maxHeight: '21rem',
          overflow: 'hidden',
          width: '20rem',
        })}
        value={value}
      />
    );
  } else {
    return (
      <DateCalendar
        disablePast={disablePast}
        onChange={(newDate) => onChange(newDate)}
        slots={{
          day: (props) => {
            const hasDateToMark = !!datesToMark.find((date) =>
              date.isSame(props.day, 'date')
            );
            const showMark = hasDateToMark && !props.outsideCurrentMonth;

            return (
              <PickersDay
                {...props}
                sx={(theme) => ({
                  '&::before': {
                    color: showMark
                      ? {
                          backgroundColor: props.selected
                            ? theme.palette.common.white
                            : theme.palette.primary.main,
                          borderRadius: '1em',
                          bottom: '0.25rem',
                          content: '""',
                          height: '0.313rem',
                          position: 'absolute',
                          width: '0.313rem',
                        }
                      : '',
                  },
                })}
              />
            );
          },
        }}
        sx={(theme) => ({
          '& .MuiDayCalendar-header': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.813rem',
            fontWeight: 500,
            letterSpacing: '0.025rem',
            lineHeight: '1.349rem',
          },
          '& .MuiPickersArrowSwitcher-root svg': {
            color: theme.palette.primary.main,
          },
          '& .MuiPickersCalendarHeader-label': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '1rem',
            fontWeight: 600,
            letterSpacing: '0.009rem',
            lineHeight: '1.5rem',
          },
          '& .MuiPickersCalendarHeader-switchViewIcon': {
            color: theme.palette.primary.main,
          },
          '& .MuiPickersDay-root': {
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.009rem',
            lineHeight: '1.313rem',
          },
          '& .MuiPickersYear-yearButton': {
            fontFamily: theme.typography.fontFamily,
          },
        })}
        value={value}
      />
    );
  }
};

export default ZUIDatePicker;
