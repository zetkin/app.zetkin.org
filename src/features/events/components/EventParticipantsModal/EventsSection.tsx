import { Box } from '@mui/material';
import { FC } from 'react';

import EventsListItem from './EventsListItem';
import { ZetkinEvent } from 'utils/types/zetkin';

type Props = {
  events: ZetkinEvent[];
  onSelect: (event: ZetkinEvent) => void;
  selectedEvent: ZetkinEvent | null;
};

const EventsSection: FC<Props> = ({ events, onSelect, selectedEvent }) => {
  return (
    <Box>
      {events.map((event) => (
        <EventsListItem
          key={event.id}
          eventId={event.id}
          onSelect={() => onSelect(event)}
          orgId={event.organization.id}
          selected={event == selectedEvent}
        />
      ))}
    </Box>
  );
};

export default EventsSection;
