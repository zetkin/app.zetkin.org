import Box from '@mui/material/Box';
import CalendarDayEvent from './CalendarDayEvent';
import CalendarDayOtherActivities from './CalendarDayOtherActivities';
import CalendarDayDate from './CalendarDayDate';
import { ZetkinEvent } from 'utils/types/zetkin';
import { DayInfo } from './types';

export interface CalendarDayItemProps {
  focusDate: Date;
  date: Date;
  dayInfo: DayInfo;
}

const CalendarDayItem = ({ focusDate, date, dayInfo }: CalendarDayItemProps) => {
  return (
    <Box
      display="flex"
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
        display="flex"
        flexDirection="column"
        sx={{
          padding: '1em',
          width: '100%',
        }}
      >
        { (dayInfo.activities_starts.length > 0 || dayInfo.activities_ends.length > 0) &&
          <CalendarDayOtherActivities dayInfo={dayInfo} />      
        }
        {dayInfo.events.map((event, i) => (
          <CalendarDayEvent event={event} />
        ))}
      </Box>
    </Box>
  );
};

export default CalendarDayItem;
