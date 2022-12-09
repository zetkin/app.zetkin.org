import { Clear } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  lighten,
  Paper,
  Popper,
  TextField,
  Typography,
} from '@mui/material';
import { DateRange, StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { IntlShape, useIntl } from 'react-intl';
import React, { FC, MouseEvent, useEffect, useState } from 'react';

const rangeStr = (intl: IntlShape, values: DateRange<Dayjs>): string => {
  const [start, end] = values;

  if (start && end) {
    return intl.formatMessage(
      { id: 'misc.dateRange.finite' },
      { end: end.toDate(), start: start.toDate() }
    );
  } else if (start) {
    return intl.formatMessage(
      { id: 'misc.dateRange.indefinite' },
      { start: start.toDate() }
    );
  } else {
    return intl.formatMessage({ id: 'misc.dateRange.draft' });
  }
};

interface ZUIDateRangePickerProps {
  endDate: string | null;
  onChange?: (startDate: string | null, endDate: string | null) => void;
  startDate: string | null;
}

const useStyles = makeStyles((theme) => ({
  label: {
    '&:hover': {
      borderBottomColor: lighten(theme.palette.primary.main, 0.65),
      borderBottomStyle: 'dotted',
      borderBottomWidth: 2,
    },
    cursor: 'pointer',
  },
}));

const ZUIDateRangePicker: FC<ZUIDateRangePickerProps> = ({
  endDate,
  onChange,
  startDate,
}) => {
  const intl = useIntl();
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs('1857-07-05'),
    dayjs('1933-06-20'),
  ]);

  const classes = useStyles();

  useEffect(() => {
    setValue([
      startDate ? dayjs(startDate) : null,
      endDate ? dayjs(endDate) : null,
    ]);
  }, [endDate, startDate]);

  // Calculate duration to use when shifting the entire range,
  // which happens when setting a start date that precedes the
  // end date, and vice versa.
  const [start, end] = value;
  const duration = start && end ? end.diff(start, 'day') : 1;

  return (
    <>
      <Typography
        className={classes.label}
        component="span"
        onClick={(ev: MouseEvent<HTMLSpanElement>) => {
          ev.stopPropagation();
          setAnchorEl(ev.currentTarget);
        }}
      >
        {rangeStr(intl, value)}
      </Typography>
      <ClickAwayListener
        onClickAway={() => {
          setAnchorEl(null);
          if (onChange) {
            onChange(
              start?.format('YYYY-MM-DD') ?? null,
              end?.format('YYYY-MM-DD') ?? null
            );
          }
        }}
      >
        <Popper anchorEl={anchorEl} open={!!anchorEl}>
          <Paper elevation={2}>
            <Box
              alignItems="stretch"
              display="flex"
              flexDirection="column"
              paddingTop={2}
            >
              <Box marginX={2} marginY={1}>
                <DateTextField
                  label="Start"
                  onChange={(date) => {
                    let newEndDate = value[1];
                    if (date && newEndDate?.isBefore(date)) {
                      newEndDate = date.add(duration, 'day');
                    }
                    setValue([date, newEndDate]);
                  }}
                  value={value[0]}
                />
              </Box>
              <Box marginX={2} marginY={1}>
                <DateTextField
                  label="End"
                  onChange={(date) => {
                    let newStartDate = value[0];
                    if (date && newStartDate?.isAfter(date)) {
                      newStartDate = date?.subtract(duration, 'day');
                    }
                    setValue([newStartDate, date]);
                  }}
                  value={value[1]}
                />
              </Box>
              <StaticDateRangePicker
                calendars={1}
                displayStaticWrapperAs="desktop"
                label="date range"
                minDate={dayjs('1800-01-01')}
                onChange={(newValue: DateRange<Dayjs>) => setValue(newValue)}
                renderInput={() => <></>}
                value={value}
              />
            </Box>
          </Paper>
        </Popper>
      </ClickAwayListener>
    </>
  );
};

interface DateTextFieldProps {
  label: string;
  onChange: (day: Dayjs | null) => void;
  value: Dayjs | null;
}

const DateTextField: FC<DateTextFieldProps> = ({ label, onChange, value }) => {
  const [rawValue, setRawValue] = useState('');

  const resetValue = () => {
    setRawValue(value?.format('l') ?? '');
  };

  useEffect(() => {
    resetValue();
  }, [value]);

  return (
    <TextField
      fullWidth
      InputProps={{
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => {
                onChange(null);
              }}
            >
              <Clear />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      label={label}
      onBlur={(ev) => {
        // If user leaves the field empty, clear
        if (ev.target.value == '') {
          onChange(null);
          return;
        }

        // If user entered a valid date, change
        // to that date, or revert to previous
        const parsed = dayjs(ev.target.value);
        if (parsed.isValid()) {
          onChange(parsed);
        } else {
          resetValue();
        }
      }}
      onChange={(ev) => {
        setRawValue(ev.target.value);
      }}
      value={rawValue}
      variant="outlined"
    />
  );
};

export default ZUIDateRangePicker;
