import { Box, Checkbox } from '@mui/material';
import { useSelector, useStore } from 'react-redux';

import { eventsSelected } from '../store';
import { RootState } from 'core/store';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventSelectionCheckBoxProps {
  eventList: ZetkinEvent[];
  multiSelect?: boolean;
}
const EventSelectionCheckBox = ({
  eventList,
  multiSelect,
}: EventSelectionCheckBoxProps) => {
  const store = useStore<RootState>();
  const selectedEvents = useSelector(
    (state: RootState) => state.events.selectedEvents
  );
  const eventId = eventList[0].id;

  const alreadyExists = selectedEvents.some(
    (selectedEvent) => selectedEvent.id == eventId
  );

  const handleChange = (checked: boolean) => {
    if (multiSelect) {
      if (checked) {
        store.dispatch(
          eventsSelected([
            ...selectedEvents,
            ...eventList.filter(
              (event) =>
                !selectedEvents.some(
                  (selectedEvent) => event.id == selectedEvent.id
                )
            ),
          ])
        );
      }
      if (!checked) {
        store.dispatch(
          eventsSelected(
            selectedEvents.filter(
              (selectedEvent) =>
                !eventList.some((event) => event.id == selectedEvent.id)
            )
          )
        );
      }
    }
    if (!multiSelect) {
      if (alreadyExists) {
        store.dispatch(
          eventsSelected(
            selectedEvents.filter(
              (selectedEvent) =>
                !eventList.some((event) => event.id == selectedEvent.id)
            )
          )
        );
      }
      if (!alreadyExists) {
        store.dispatch(eventsSelected([...selectedEvents, ...eventList]));
      }
    }
  };

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <Checkbox
        checked={eventList.every((event) =>
          selectedEvents.some((selectedEvent) => event.id === selectedEvent.id)
        )}
        onChange={(e) => {
          handleChange(e.target.checked);
        }}
        sx={{ px: 0.2, py: 0 }}
        size="small"
      />
    </Box>
  );
};

export default EventSelectionCheckBox;
