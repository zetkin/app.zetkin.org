import Box from '@mui/material/Box';
import { ZetkinEvent } from 'utils/types/zetkin';

export interface CalendarDayEventProps {
  event: ZetkinEvent;
}

const CalendarDayEvent = ({
  event,
}: CalendarDayEventProps) => {
  return <Box display="flex"
    sx={{
      margin: "0.5em",
      padding: "0.5em",
      backgroundColor: 'white',
    }}
  >
    {event.title || event.activity.title}
  </Box>
};

export default CalendarDayEvent;