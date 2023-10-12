import deleteEventsRpc from 'features/events/rpc/deleteEvents';
import updateEventsRpc from 'features/events/rpc/updateEvents';
import { eventDeleted, eventUpdated, resetSelection } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

type useEventsMutationsReturn = {
  deleteEvents: (events: number[]) => void;
  updateEvents: (
    eventIds: number[],
    published: boolean,
    cancelled: boolean
  ) => void;
};

export default function useEventsMutations(
  orgId: number
): useEventsMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteEvents = async (events: number[]) => {
    const result = await apiClient.rpc(deleteEventsRpc, {
      events,
      orgId,
    });

    result.removedEvents.forEach((event) => {
      dispatch(eventDeleted(event));
    });
    dispatch(resetSelection());
  };

  const updateEvents = async (
    eventIds: number[],
    published: boolean,
    cancelled: boolean
  ) => {
    const events = eventIds.map((id) => ({
      cancelled: cancelled ? new Date().toISOString() : null,
      id: id,
      published: published ? new Date().toISOString() : null,
    }));

    const result = await apiClient.rpc(updateEventsRpc, {
      events,
      orgId: orgId.toString(),
    });

    result.forEach((event) => {
      dispatch(eventUpdated(event));
    });
    dispatch(resetSelection());
  };

  return { deleteEvents, updateEvents };
}
