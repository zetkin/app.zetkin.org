import { Clear } from '@mui/icons-material';
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Popper,
  TextField,
} from '@mui/material';
import { DateRange, StaticDateRangePicker } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import React, { FC, useCallback, useEffect, useState } from 'react';

const ZUIDateRangePicker: FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<DateRange<Dayjs>>([
    dayjs('1857-07-05'),
    dayjs('1933-06-20'),
  ]);

  const callback = useCallback((elem: HTMLDivElement) => {
    setAnchorEl(elem);
  }, []);

  return (
    <>
      <span ref={callback}>Label</span>
      <Popper anchorEl={anchorEl} open={true}>
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
                  setValue([date, value[1]]);
                }}
                value={value[0]}
              />
            </Box>
            <Box marginX={2} marginY={1}>
              <DateTextField
                label="End"
                onChange={(date) => {
                  setValue([value[0], date]);
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
