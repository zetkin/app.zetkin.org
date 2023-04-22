import Box from '@mui/material/Box';
import CalendarDayEvent from './CalendarDayEvent';
import CalendarDayOtherActivities from './CalendarDayOtherActivities';
import CalendarDayDate from './CalendarDayDate';

const CalendarDayItem = () => {
  return <Box display="flex"
    sx={{
      marginBottom: '0.5em',
      backgroundColor: '#eeeeee',
    }}
  >
    <Box
      sx={{
        width: 300,
      }}
    >
      <CalendarDayDate focusDate={new Date("2023-04-23")} date={new Date()} />
    </Box>
    <Box
      display="flex" flexDirection="column"
      sx={{
        padding: "1em",
        width: "100%",
      }}
    >
      <CalendarDayOtherActivities />
      <CalendarDayEvent/>
      <CalendarDayEvent/>
      <CalendarDayEvent/>
    </Box>
  </Box>
};

export default CalendarDayItem;


