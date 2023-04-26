import theme from 'theme';
import { Box, Typography } from '@mui/material';

type CalendarWeekNumberProps = {
  weekNr: number;
};

const WeekNumber = ({ weekNr }: CalendarWeekNumberProps) => {
  return (
    <Box marginTop="2px">
      <Typography
        color={theme.palette.secondary.light}
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
