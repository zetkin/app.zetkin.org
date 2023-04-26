import { Box, Typography } from '@mui/material';

type CalendarWeekNumberProps = {
  weekNr: number;
};

const WeekNumber = ({ weekNr }: CalendarWeekNumberProps) => {
  return (
    <Box marginTop="2px">
      <Typography color="#9f9f9f" fontSize=".8rem" fontWeight={600}>
        {weekNr}
      </Typography>
    </Box>
  );
};

export default WeekNumber;
