import Box from '@mui/material/Box';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface CalendarDayEventProps {
  event: ZetkinEvent;
}

const CalendarDayEvent = ({ event }: CalendarDayEventProps) => {
  return (
    <Box
      display="flex"
      sx={{
        backgroundColor: 'white',
        margin: '0.5em',
        padding: '0.5em',
      }}
    >
      {event.title || event.activity.title}
    </Box>
  );
};

export default CalendarDayEvent;
