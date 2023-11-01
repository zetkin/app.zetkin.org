import { useAppSelector } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useSelectedEvents() {
  const selectedEventIds = useAppSelector(
    (state) => state.events.selectedEventIds
  );
  const events = useAppSelector((state) =>
    state.events.eventList.items.map((item) => item.data)
  );
  const selectedEvents = selectedEventIds
    .map((selectedEventId) =>
      events.find((event) => event?.id === selectedEventId)
    )
    .filter((event) => !!event) as ZetkinEvent[];

  return selectedEvents;
}
