import { KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

import DateLabel from './Day/DateLabel';
import { DaySummary } from './utils';
import theme from 'theme';

const PreviousDayPrompt = ({
  date,
  daySummary,
  onClickShowMore,
}: {
  date: Date;
  daySummary: DaySummary;
  onClickShowMore: () => void;
}) => {
  return (
    <Box alignItems="center" display="flex" padding={1}>
      <DateLabel date={date} />
      <Box
        alignItems="center"
        display="flex"
        flexGrow={1}
        gap={1}
        justifyContent="center"
      >
        <Typography color={theme.palette.secondary.main}>
          There were {daySummary.events.length} events on the last active day
        </Typography>
        <Button
          endIcon={<KeyboardArrowUp />}
          onClick={onClickShowMore}
          variant="text"
        >
          Show
        </Button>
      </Box>
    </Box>
  );
};

export default PreviousDayPrompt;
