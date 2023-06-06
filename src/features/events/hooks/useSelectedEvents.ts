import { RootState } from 'core/store';
import { useSelector } from 'react-redux';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useSelectedEvents() {
  const selectedEventIds = useSelector(
    (state: RootState) => state.events.selectedEventIds
  );
  const events = useSelector((state: RootState) =>
    state.events.eventList.items.map((item) => item.data)
  );
  const selectedEvents = selectedEventIds
    .map((selectedEventId) =>
      events.find((event) => event?.id === selectedEventId)
    )
    .filter((event) => !!event) as ZetkinEvent[];

  return selectedEvents;
}
