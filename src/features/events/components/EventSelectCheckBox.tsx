import { Checkbox } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import { eventsSelected } from '../store';
import { RootState } from 'core/store';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventSelectCheckBoxProps {
  events?: ZetkinEvent[];
  event?: ZetkinEvent;
}
const EventSelectCheckBox = ({ events, event }: EventSelectCheckBoxProps) => {
  const store = useStore<RootState>();
  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );
  const eventId = events ? events[0].id : event!.id;

  const alreadyExists = selectedEvents.some(
    (selectedEvent) => selectedEvent.id == eventId
  );

  const handleChange = () => {
    if (alreadyExists) {
      store.dispatch(
        eventsSelected(
          selectedEvents.filter((selectedEvent) =>
            events
              ? !events.some((event) => event.id == selectedEvent.id)
              : selectedEvent.id != event!.id
          )
        )
      );
    } else {
      store.dispatch(
        eventsSelected(
          events ? [...selectedEvents, ...events] : [...selectedEvents, event!]
        )
      );
    }
  };

  return (
    <Checkbox
      checked={
        events
          ? events?.every((event) =>
              selectedEvents.some(
                (selectedEvent) => event.id === selectedEvent.id
              )
            )
          : alreadyExists ?? false
      }
      onChange={handleChange}
      sx={{ padding: '0px' }}
    />
  );
};

export default EventSelectCheckBox;
