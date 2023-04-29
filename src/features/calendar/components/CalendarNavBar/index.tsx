import { Box } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton } from '@mui/material';

import MonthSelect from './MonthSelect';
import { TimeScale } from '../index';
import YearSelect from './YearSelect';

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
      <Box alignItems="center" display="flex" gap="4px">
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
        <MonthSelect
          focusDate={focusDate}
          onChange={(date) => onChangeFocusDate(date)}
        />
        <YearSelect
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

export default CalendarNavBar;
