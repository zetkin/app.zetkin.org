import { makeStyles } from '@mui/styles';
import { StaticDatePicker } from '@mui/x-date-pickers-pro';
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
import { Clear, Schedule, VisibilityOutlined } from '@mui/icons-material';
import dayjs, { Dayjs } from 'dayjs';
import { IntlShape, useIntl } from 'react-intl';
import React, { FC, MouseEvent, useEffect, useState } from 'react';

import { EyeClosed } from 'zui/icons/EyeClosed';
import messageIds from 'zui/l10n/messageIds';
import { useMessages, UseMessagesMap } from 'core/i18n';

const iconAndMessage = (
  intl: IntlShape,
  messages: UseMessagesMap<typeof messageIds.dateRange>,
  date: Dayjs | null
): { icon: JSX.Element; message: string } => {
  const now = dayjs();

  const thisYear = now.year();
  const startYear = date?.year();

  if (date) {
    if (date.isAfter(new Date())) {
      //Scheduled, onwards
      return {
        icon: <Schedule color="secondary" />,
        message: messages.indefinite({
          start: intl.formatDate(date.toDate(), {
            day: 'numeric',
            month: 'long',
            ...(startYear !== thisYear && { year: 'numeric' }),
          }),
        }),
      };
    }
    return {
      //Visible onwards
      icon: <VisibilityOutlined color="secondary" />,
      message: messages.indefinite({
        start: intl.formatDate(date.toDate(), {
          day: 'numeric',
          month: 'long',
          ...(startYear !== thisYear && { year: 'numeric' }),
        }),
      }),
    };
  } else {
    //Draft, invisible
    return {
      icon: <EyeClosed />,
      message: messages.invisible(),
    };
  }
};

interface ZUIDatePickerProps {
  onChange?: (date: string | null) => void;
  date: string | null;
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

const ZUIDatePicker: FC<ZUIDatePickerProps> = ({ onChange, date }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [value, setValue] = useState<Dayjs | null>(null);

  const classes = useStyles();
  const messages = useMessages(messageIds);
  const intl = useIntl();

  useEffect(() => {
    setValue(date ? dayjs(date) : null);
  }, [date]);

  const { icon, message } = iconAndMessage(intl, messages.dateRange, value);

  return (
    <>
      <Box alignItems="center" className={classes.label} display="flex">
        <Box
          component="span"
          display="flex"
          justifyContent="center"
          marginLeft={1}
          onClick={(ev: MouseEvent<HTMLSpanElement>) => {
            ev.stopPropagation();
            setAnchorEl(ev.currentTarget);
          }}
        >
          {icon}
          <Typography color="secondary" sx={{ paddingLeft: 0.5 }}>
            {message}
          </Typography>
        </Box>
      </Box>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        onClickAway={() => {
          setAnchorEl(null);
          if (onChange) {
            onChange(value?.format('YYYY-MM-DD') ?? null);
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
                  onChange={(newDate) => {
                    setValue(newDate);
                  }}
                  value={value}
                />
              </Box>
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                minDate={dayjs('1800-01-01')}
                onChange={(newValue: Dayjs | null) => setValue(newValue)}
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

export default ZUIDatePicker;
