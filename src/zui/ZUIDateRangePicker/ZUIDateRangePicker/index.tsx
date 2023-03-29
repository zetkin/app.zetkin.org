import { makeStyles } from '@mui/styles';
import { useIntl } from 'react-intl';
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
import { CalendarToday, Clear } from '@mui/icons-material';
import { DateRange, StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, MouseEvent, useEffect, useState } from 'react';

import messageIds from 'zui/l10n/messageIds';
import { useMessages, UseMessagesMap } from 'core/i18n';

const rangeStr = (
  messages: UseMessagesMap<typeof messageIds.dateRange>,
  values: DateRange<Dayjs>
): string => {
  const [start, end] = values;

  if (start && end) {
    return messages.finite({ end: end.toDate(), start: start.toDate() });
  } else if (start) {
    return messages.indefinite({ start: start.toDate() });
  } else {
    return messages.draft();
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
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);

  const classes = useStyles();
  const messages = useMessages(messageIds);

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
      <Box alignItems="center" className={classes.label} display="flex">
        <CalendarToday />

        <Typography
          component="span"
          marginLeft={1}
          onClick={(ev: MouseEvent<HTMLSpanElement>) => {
            ev.stopPropagation();
            setAnchorEl(ev.currentTarget);
          }}
        >
          {rangeStr(messages.dateRange, value)}
        </Typography>
      </Box>
      <ClickAwayListener
        mouseEvent="onMouseDown"
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
                  label={messages.dateRange.start()}
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
                  label={messages.dateRange.end()}
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
  const intl = useIntl();

  const resetValue = () => {
    setRawValue(
      value
        ? intl.formatDate(value.toDate(), {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          })
        : ''
    );
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
