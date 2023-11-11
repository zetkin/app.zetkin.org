import { FC } from 'react';
import useEventsFromDateRange from 'features/events/hooks/useEventsFromDateRange';
import { Card, Typography } from '@mui/material';

type EventListingProps = {
  orgId: number;
  campId: number;
};

const EventListing: FC<EventListingProps> = ({ orgId, campId }) => {
  const eventsFromDateRange = useEventsFromDateRange(
    new Date(),
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  ); // TODO: Smarter date handling. We dont just want to do next 60 days.
  console.log('Events with date range', eventsFromDateRange);

  return (
    <>
      {eventsFromDateRange &&
        eventsFromDateRange.map((data) => {
          return (
            <Card>
              <Typography>{data.data.info_text}</Typography>
            </Card>
          );
        })}
    </>
  );
};

export default EventListing;
