import { FC } from 'react';
import { Box, Fade, Typography } from '@mui/material';

import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';
import { ZetkinEventWithStatus } from '../types';
import ZUIDate from 'zui/ZUIDate';
import useIncrementalDelay from '../hooks/useIncrementalDelay';

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();
  const nextDelay = useIncrementalDelay();

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
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <div>
              <Typography my={1} variant="h5">
                <ZUIDate datetime={date} />
              </Typography>
            </div>
          </Fade>
          <Fade appear in mountOnEnter style={{ transitionDelay: nextDelay() }}>
            <Box display="flex" flexDirection="column" gap={1}>
              {eventsByDate[date].map((event) => (
                <EventListItem key={event.id} event={event} />
              ))}
            </Box>
          </Fade>
        </Box>
      ))}
    </Box>
  );
};

export default AllEventsList;
