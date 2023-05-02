import { KeyboardArrowUp } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';

import DateLabel from './Day/DateLabel';
import theme from 'theme';

const PreviousDayPrompt = ({
  onClickShowMore,
}: {
  onClickShowMore: () => void;
}) => {
  return (
    <Box alignItems="center" display="flex" padding={1}>
      <DateLabel date={new Date('2022-01-01')} />
      <Box
        alignItems="center"
        display="flex"
        flexGrow={1}
        gap={1}
        justifyContent="center"
      >
        <Typography color={theme.palette.secondary.main}>
          There were X activities on the previous active day
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
