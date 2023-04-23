import { Box } from '@mui/system';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton } from '@mui/material';

import { TimeScale } from '.';
import { useFocusDate } from 'utils/hooks/useFocusDate';

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
      <Box display="flex" alignItems="center" gap="4px">
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
        {/* Placeholders just to know which date we're on. */}
        <Box>
          {focusDate.toLocaleDateString("en", {month: "long"})}
        </Box>
        <Box>
          {focusDate.toLocaleDateString("en", {year: "numeric"})}
        </Box>
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
