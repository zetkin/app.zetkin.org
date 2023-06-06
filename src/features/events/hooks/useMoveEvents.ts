import { useDispatch } from 'react-redux';

import getOffsetStartEnd from '../components/SelectionBar/getOffsetStartEnd';
import updateEvents from '../rpc/updateEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsUpdate, eventsUpdated, resetSelection } from '../store';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

export default function useMoveEvents() {
  const { orgId } = useNumericRouteParams();
  const apiClient = useApiClient();
  const dispatch = useDispatch();

  const moveEvents = async (events: ZetkinEvent[], offset: number) => {
    const eventsWithNewDates = events.map((event) => {
      const currentEventStart = new Date(event.start_time);
      const currentEventEnd = new Date(event.end_time);

      const eventLength =
        currentEventEnd.getTime() - currentEventStart.getTime();

      const [newStart] = getOffsetStartEnd([event], offset);
      const newEnd = new Date(newStart.getTime() + eventLength);

      const newStartTime = new Date(
        Date.UTC(
          newStart.getUTCFullYear(),
          newStart.getUTCMonth(),
          newStart.getUTCDate(),
          newStart.getUTCHours(),
          newStart.getUTCMinutes()
        )
      );
      const newEndTime = new Date(
        Date.UTC(
          newEnd.getUTCFullYear(),
          newEnd.getUTCMonth(),
          newEnd.getDate(),
          newEnd.getUTCHours(),
          newEnd.getUTCMinutes()
        )
      );

      return {
        end_time: newEndTime.toISOString(),
        id: event.id,
        start_time: newStartTime.toISOString(),
      };
    });

    dispatch(
      eventsUpdate([events.map((e) => e.id), ['start_time', 'end_time']])
    );
    const updatedEvents = await apiClient.rpc(updateEvents, {
      events: eventsWithNewDates,
      orgId: orgId.toString(),
    });
    dispatch(eventsUpdated(updatedEvents));
    dispatch(resetSelection());
  };

  return {
    moveEvents,
  };
}
