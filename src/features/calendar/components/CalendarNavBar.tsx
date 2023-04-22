import { Box } from '@mui/system';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton } from '@mui/material';

// import { TimeScale } from '.';

export interface CalendarNavBarProps {
  focusDate: Date;
  onChangeFocusDate: (date: Date) => void;
  // onChangeTimeScale: () => void;
  // onStepBackward: () => void;
  // onStepForward: () => void;
  // timeScale: TimeScale;
}

const CalendarNavBar = ({ onChangeFocusDate }: CalendarNavBarProps) => {
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
        <IconButton>
          <ArrowBack />
        </IconButton>
        <IconButton>
          <ArrowForward />
        </IconButton>
      </Box>

      <ButtonGroup>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    </Box>
  );
};

export default CalendarNavBar;
