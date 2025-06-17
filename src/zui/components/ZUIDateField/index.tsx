import { FC, RefObject, useState } from 'react';
import { Dayjs } from 'dayjs';
import {
  DatePicker,
  DateValidationError,
  PickersDay,
} from '@mui/x-date-pickers';

import { ZUIDatePickerProps } from '../ZUIDatePicker';
import { ZUILarge, ZUIMedium } from '../types';

type ZUIDateFieldProps = Pick<
  ZUIDatePickerProps,
  'datesToMark' | 'disablePast'
> & {
  /**
   * If the field should be full width or not.
   * Defaults to "false".
   */
  fullWidth?: boolean;

  /**
   * Pass a ref to the input element.
   */
  inputRef?: RefObject<HTMLInputElement>;

  /**
   * The label of the date field.
   */
  label: string;

  /**
   *
   * The function that runs when the value changes.
   */
  onChange: (newDate: Dayjs | null) => void;

  /**
   * The size of the component.
   */
  size?: ZUIMedium | ZUILarge;

  /**
   * The value of the date field.
   */
  value: Dayjs | null;
};

const ZUIDateField: FC<ZUIDateFieldProps> = ({
  disablePast = false,
  datesToMark = [],
  fullWidth = false,
  inputRef,
  label,
  onChange,
  size = 'medium',
  value,
}) => {
  const [error, setError] = useState<DateValidationError | null>(null);
  return (
    <DatePicker
      disablePast={disablePast}
      inputRef={inputRef}
      label={label}
      onChange={(newDate) => onChange(newDate)}
      onError={(newError) => setError(newError)}
      slotProps={{
        openPickerIcon: {
          sx: {
            fontSize: '1.5rem',
          },
        },
        popper: {
          sx: (theme) => ({
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
          }),
        },
        textField: {
          fullWidth: fullWidth,
          sx: (theme) => ({
            '& > label': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: '500',
              letterSpacing: '3%',
              transform: `translate(0.875rem, ${
                size == 'medium' ? '0.563rem' : '1rem'
              })`,
            },
            '& > label[data-shrink="true"]': {
              color: error
                ? theme.palette.error.main
                : theme.palette.secondary.main,
              fontSize: '0.813rem',
              transform: 'translate(0.813rem, -0.625rem)',
            },
            '& >.MuiFormHelperText-root': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: 400,
              letterSpacing: '3%',
              lineHeight: '1.219rem',
            },
            '& >.MuiInputBase-root > fieldset > legend > span': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '0.813rem',
              fontWeight: '500',
              letterSpacing: '3%',
              paddingLeft: '0.25rem',
              paddingRight: '0.25rem',
            },
            '& >.MuiInputBase-root > input': {
              fontFamily: theme.typography.fontFamily,
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '1%',
              lineHeight: '1.5rem',
              paddingY: size == 'medium' ? '0.594rem' : '',
            },
          }),
        },
      }}
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
      value={value}
    />
  );
};

export default ZUIDateField;
