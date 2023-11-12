import { Box } from '@mui/material';
import { FC } from 'react';

import EventSignUpCard from './EventSignUpCard';
import { ZetkinEvent } from 'utils/types/zetkin';

type EventSignUpListProps = {
  events: ZetkinEvent[];
};

const EventSignUpList: FC<EventSignUpListProps> = ({ events }) => {
  return (
    <Box>
      {events.map((event) => {
        return <EventSignUpCard key={event.id} event={event} />;
      })}
    </Box>
  );
};

export default EventSignUpList;
