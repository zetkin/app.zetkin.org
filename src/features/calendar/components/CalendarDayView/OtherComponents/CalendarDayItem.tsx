import Box from '@mui/material/Box';

import CalendarDayDate from './CalendarDayDate';
import { DayInfo } from '../types';
import CalendarDayViewActivity, {
  STATUS_COLORS,
} from './CalendarDayViewActivity';

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
        backgroundColor: '#eeeeee',
        marginBottom: '0.5em',
      }}
    >
      <Box
        sx={{
          width: 300,
        }}
      >
        <Box
          sx={{
            padding: '1em',
          }}
        >
          <CalendarDayDate date={date} focusDate={focusDate} />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          gap: '0.7em',
          padding: '1em',
          width: '100%',
        }}
      >
        {dayInfo.events.map((event, index) => (
          // TODO: Use statusColor in reasonable way
          <CalendarDayViewActivity
            key={index}
            event={event}
            statusColor={STATUS_COLORS.GREEN}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CalendarDayItem;
