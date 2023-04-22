import Box from '@mui/material/Box';
import CalendarDayEvent from './CalendarDayEvent';
import CalendarDayOtherActivities from './CalendarDayOtherActivities';

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
      <Box
        display="inline-block"
        padding={1}
        color="white"
        sx={{
          borderRadius: "16px",
          backgroundColor: 'blue',
        }}
      >
        10 May, Mon
      </Box>
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


