import { Box } from '@mui/system';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Button, ButtonGroup, IconButton } from '@mui/material';

const CalendarNavBar = () => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box>
        <Button color="primary" variant="outlined">
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
