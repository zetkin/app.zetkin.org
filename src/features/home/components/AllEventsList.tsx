import { FC } from 'react';
import { Box } from '@mui/material';

import useAllEvents from 'features/events/hooks/useAllEvents';
import EventListItem from './EventListItem';

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();

  return (
    <Box display="flex" flexDirection="column" gap={1} m={1}>
      {allEvents.map((event) => (
        <EventListItem key={event.id} event={event} />
      ))}
    </Box>
  );
};

export default AllEventsList;
