'use client';

import dayjs from 'dayjs';
import { Box, Fade, Typography } from '@mui/material';
import { FC, useMemo } from 'react';

import useUpcomingOrgEvents from '../hooks/useUpcomingOrgEvents';
import EventListItem from 'features/home/components/EventListItem';
import { ZetkinEventWithStatus } from 'features/home/types';
import useIncrementalDelay from 'features/home/hooks/useIncrementalDelay';
import ZUIDate from 'zui/ZUIDate';

type Props = {
  orgId: number;
};

const PublicOrgPage: FC<Props> = ({ orgId }) => {
  const nextDelay = useIncrementalDelay();
  const orgEvents = useUpcomingOrgEvents(orgId);

  const events = useMemo(() => {
    return orgEvents.map<ZetkinEventWithStatus>((event) => ({
      ...event,
      status: null,
    }));
  }, [orgEvents]);

  const eventsByDate = events.reduce<Record<string, ZetkinEventWithStatus[]>>(
    (dates, event) => {
      const eventDate = event.start_time.slice(0, 10);
      const existingEvents = dates[eventDate] || [];

      const firstFilterDate = dayjs().format('YYYY-MM-DD');

      const dateToSortAs =
        firstFilterDate && eventDate < firstFilterDate
          ? firstFilterDate
          : eventDate;

      return {
        ...dates,
        [dateToSortAs]: [...existingEvents, event],
      };
    },
    {}
  );

  const dates = Object.keys(eventsByDate).sort();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
      {dates.map((date) => (
        <Box key={date} paddingX={1}>
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

export default PublicOrgPage;
