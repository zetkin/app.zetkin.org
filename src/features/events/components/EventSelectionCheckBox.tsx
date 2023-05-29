import { Box, Checkbox } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import { RootState } from 'core/store';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsDeselected, eventsSelected } from '../store';

interface EventSelectionCheckBoxProps {
  events: ZetkinEvent[];
}

const EventSelectionCheckBox = ({ events }: EventSelectionCheckBoxProps) => {
  const store = useStore<RootState>();
  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );

  const alreadyExists = events.some((event) =>
    selectedEvents.some((selectedEvent) => event.id === selectedEvent)
  );
  const allEventsChecked = events.every((event) =>
    selectedEvents.some((selectedEvent) => event.id === selectedEvent)
  );
  console.log(events, 'events');
  // console.log(selectedEvents, 'selected events');

  const handleChange = (checked: boolean) => {
    if (events.length > 1) {
      if (checked) {
        store.dispatch(eventsSelected(events));
      }
      if (!checked) {
        store.dispatch(eventsDeselected(events));
      }
    }

    if (events.length === 1) {
      if (checked) {
        store.dispatch(eventsSelected(events));
      }
      if (!checked) {
        store.dispatch(eventsDeselected(events));
      }
    }
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Checkbox
        checked={allEventsChecked}
        indeterminate={!allEventsChecked && alreadyExists}
        onClick={(ev) => {
          handleChange(!allEventsChecked);
          ev.stopPropagation();
        }}
        onClickCapture={(ev) => {
          ev.preventDefault();
        }}
        size="small"
        sx={{ px: 0.2, py: 0 }}
      />
    </Box>
  );
};

export default EventSelectionCheckBox;
