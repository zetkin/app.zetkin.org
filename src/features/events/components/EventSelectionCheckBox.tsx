import { Box, Checkbox } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import { eventsDeselected, eventsSelected } from '../store';
import { RootState } from 'core/store';

interface EventSelectionCheckBoxProps {
  events: number[];
}
const EventSelectionCheckBox = ({ events }: EventSelectionCheckBoxProps) => {
  const store = useStore<RootState>();
  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );

  const alreadyExists = events.some((event) =>
    selectedEvents.some((selectedEvent) => event === selectedEvent)
  );
  const allEventsChecked = events.every((event) =>
    selectedEvents.some((selectedEvent) => event === selectedEvent)
  );

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
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
        size="small"
        sx={{ px: 0.2, py: 0 }}
      />
    </Box>
  );
};

export default EventSelectionCheckBox;
