import Box from '@mui/material/Box';
import CalendarDayItem from './CalendarDayItem';

const CalendarDayView = () => {
  return <Box sx={{
      flexDirection: 'row',
      backgroundColor: 'green',
    }}>
    <CalendarDayItem/>
    <CalendarDayItem/>
    <CalendarDayItem/>
  </Box>
};

export default CalendarDayView;
