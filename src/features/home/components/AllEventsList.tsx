import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import { ZetkinEventWithStatus } from '../types';
import ZUIDate from 'zui/ZUIDate';

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();

  const eventsByDate = allEvents.reduce<
    Record<string, ZetkinEventWithStatus[]>
  >((dates, event) => {
    const eventDate = event.start_time.slice(0, 10);
    const existingEvents = dates[eventDate] || [];

    return {
      ...dates,
      [eventDate]: [...existingEvents, event],
    };
  }, {});

  const dates = Object.keys(eventsByDate).sort();

  return (
    <Box display="flex" flexDirection="column" gap={2} m={1}>
      {dates.map((date) => (
        <Box key={date}>
          <Typography my={1} variant="h5">
            <ZUIDate datetime={date} />
          </Typography>
          <Box display="flex" flexDirection="column" gap={1}>
            {eventsByDate[date].map((event) => (
              <EventListItem key={event.id} event={event} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AllEventsList;
