import { FC } from 'react';
import { Box } from '@mui/material';

import useAllEvents from 'features/events/hooks/useAllEvents';

const AllEventsList: FC = () => {
  const allEvents = useAllEvents();

  return (
    <Box>
      {allEvents.map((event) => (
        <Box key={event.id}>{event.id}</Box>
      ))}
    </Box>
  );
};

export default AllEventsList;
