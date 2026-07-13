import { Box, Typography } from '@mui/material';

import oldTheme from 'theme';

type CalendarWeekNumberProps = {
  onClick: () => void;
  weekNr: number;
};

const WeekNumber = ({ onClick, weekNr }: CalendarWeekNumberProps) => {
  return (
    <Box
      marginTop="2px"
      onClick={() => onClick()}
      sx={{
        cursor: 'pointer',
      }}
    >
      <Typography
        color={oldTheme.palette.secondary.light}
        fontStyle="bold"
        sx={{ fontWeight: 800 }}
        variant="body2"
      >
        {weekNr}
      </Typography>
    </Box>
  );
};

export default WeekNumber;
