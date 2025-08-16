import { Box, Checkbox } from '@mui/material';

import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsDeselected, eventsSelected } from '../store';
import { useAppDispatch, useAppSelector } from 'core/hooks';

interface EventSelectionCheckBoxProps {
  events: ZetkinEvent[];
}

const EventSelectionCheckBox = ({ events }: EventSelectionCheckBoxProps) => {
  const dispatch = useAppDispatch();
  const selectedEvents = useAppSelector(
    (state) => state.events.selectedEventIds
  );

  const alreadyExists = events.some((event) =>
    selectedEvents.some((selectedEvent) => event.id === selectedEvent)
  );
  const allEventsChecked = events.every((event) =>
    selectedEvents.some((selectedEvent) => event.id === selectedEvent)
  );

  const handleChange = (checked: boolean) => {
    const eventIds = events.map((e) => e.id);
    if (events.length > 1) {
      if (checked) {
        dispatch(eventsSelected(eventIds));
      }
      if (!checked) {
        dispatch(eventsDeselected(eventIds));
      }
    }

    if (events.length === 1) {
      if (checked) {
        dispatch(eventsSelected(eventIds));
      }
      if (!checked) {
        dispatch(eventsDeselected(eventIds));
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
