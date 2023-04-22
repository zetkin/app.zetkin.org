import Box from '@mui/material/Box';
import CalendarDayItem from './CalendarDayItem';

const CalendarDayView = () => {
  return <Box sx={{
      flexDirection: 'row',
      marginTop: '1em'
    }}>
    <CalendarDayItem/>
    <CalendarDayItem/>
    <CalendarDayItem/>
  </Box>
};

export default CalendarDayView;
