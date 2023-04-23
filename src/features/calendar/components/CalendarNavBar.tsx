import _ from 'lodash';
import { Box } from '@mui/system';
import dayjs from 'dayjs';
import { TimeScale } from '.';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';

export interface CalendarNavBarProps {
  focusDate: Date;
  onChangeFocusDate: (date: Date) => void;
  onChangeTimeScale: (timeScale: TimeScale) => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  timeScale: TimeScale;
}

const CalendarNavBar = ({
  focusDate,
  onChangeFocusDate,
  onChangeTimeScale,
  onStepBackward,
  onStepForward,
  timeScale,
}: CalendarNavBarProps) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box>
        <Button
          color="primary"
          onClick={() => onChangeFocusDate(new Date())}
          variant="outlined"
        >
          Today
        </Button>
        <IconButton onClick={onStepBackward}>
          <ArrowBack />
        </IconButton>
        <IconButton onClick={onStepForward}>
          <ArrowForward />
        </IconButton>
        <CalendarMonthSelect
          focusDate={focusDate}
          onChange={(date) => onChangeFocusDate(date)}
        />
        <CalendarYearSelect
          focusDate={focusDate}
          onChange={(date) => onChangeFocusDate(date)}
        />
      </Box>

      <ButtonGroup>
        <Button
          onClick={() => onChangeTimeScale(TimeScale.DAY)}
          variant={timeScale === TimeScale.DAY ? 'contained' : 'outlined'}
        >
          Day
        </Button>
        <Button
          onClick={() => onChangeTimeScale(TimeScale.WEEK)}
          variant={timeScale === TimeScale.WEEK ? 'contained' : 'outlined'}
        >
          Week
        </Button>
        <Button
          onClick={() => onChangeTimeScale(TimeScale.MONTH)}
          variant={timeScale === TimeScale.MONTH ? 'contained' : 'outlined'}
        >
          Month
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export interface CalendarMonthSelectProps {
  focusDate: Date;
  onChange: (date: Date) => void;
}

const CalendarMonthSelect = ({
  focusDate,
  onChange,
}: CalendarMonthSelectProps) => {
  return (
    <Select
      disableUnderline
      onChange={(event) => {
        const newMonth =
          typeof event.target.value === 'number'
            ? event.target.value
            : parseInt(event.target.value);
        const newDate = dayjs(focusDate).month(newMonth);
        onChange(newDate.toDate());
      }}
      value={focusDate.getMonth()}
      variant="standard"
    >
      {_.range(12).map((index) => {
        return (
          <MenuItem key={index} value={index}>
            {index}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export interface CalendarYearSelectProps {
  focusDate: Date;
  onChange: (date: Date) => void;
}

const CalendarYearSelect = ({
  focusDate,
  onChange,
}: CalendarYearSelectProps) => {
  const amountOfYears = 18;
  const startYear = focusDate.getFullYear() - 8;

  return (
    <Select
      disableUnderline
      onChange={(event) => {
        const newYear =
          typeof event.target.value === 'number'
            ? event.target.value
            : parseInt(event.target.value);
        const newDate = dayjs(focusDate).year(newYear);
        onChange(newDate.toDate());
      }}
      value={focusDate.getFullYear()}
      variant="standard"
    >
      {_.range(amountOfYears).map((index) => {
        const year = dayjs(focusDate)
          .year(startYear + index)
          .year();
        return (
          <MenuItem key={index} value={year}>
            {year}
          </MenuItem>
        );
      })}
    </Select>
  );
};

export default CalendarNavBar;
