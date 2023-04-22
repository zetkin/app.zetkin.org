import Box from '@mui/material/Box';
import CalendarDayEvent from './CalendarDayEvent';

const CalendarDayItem = () => {
  return <Box display="flex"
    sx={{
      backgroundColor: 'primary.light',
    }}
  >
    <Box
      sx={{
        width: 300,
        backgroundColor: 'primary.light',
      }}
    >
      Date
    </Box>
    <Box
      sx={{
        padding: "1em",
        width: "100%",
        backgroundColor: 'primary.light',
      }}
    >
      <CalendarDayEvent/>
      <CalendarDayEvent/>
      <CalendarDayEvent/>
    </Box>
  </Box>
};

export default CalendarDayItem;


