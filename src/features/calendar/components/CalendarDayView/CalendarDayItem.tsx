import Box from '@mui/material/Box';
import CalendarDayEvent from './CalendarDayEvent';
import CalendarDayDate from './CalendarDayDate';
import CalendarDayOtherActivities from './CalendarDayOtherActivities';
import { DayInfo } from './types';

export interface CalendarDayItemProps {
  date: Date;
  dayInfo: DayInfo;
  focusDate: Date;
}

const CalendarDayItem = ({
  date,
  dayInfo,
  focusDate,
}: CalendarDayItemProps) => {
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
        {(dayInfo.activities_starts.length > 0 ||
          dayInfo.activities_ends.length > 0) && (
          <CalendarDayOtherActivities dayInfo={dayInfo} />
        )}
        {dayInfo.events.map((event, i) => (
          <CalendarDayEvent event={event} />
        ))}
      </Box>
    </Box>
  );
};

export default CalendarDayItem;
