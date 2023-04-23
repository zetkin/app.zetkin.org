import Box from '@mui/material/Box';
import CalendarDayEvent from './CalendarDayEvent';
import CalendarDayOtherActivities from './CalendarDayOtherActivities';
import CalendarDayDate from './CalendarDayDate';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface CalendarDayItemProps {
  focusDate: Date;
  date: Date;
  // event: 
}

const CalendarDayItem = ({
  focusDate,
  date
}: CalendarDayItemProps) => {
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
      <CalendarDayDate focusDate={focusDate} date={date} />
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


