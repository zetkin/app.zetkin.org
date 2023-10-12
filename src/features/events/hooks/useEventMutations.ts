import { ZetkinEvent } from 'utils/types/zetkin';
import {
  eventCreate,
  eventCreated,
  eventDeleted,
  eventUpdate,
  eventUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEventPatchBody, ZetkinEventPostBody } from '../repo/EventsRepo';

type useEventMutationsReturn = {
  cancelEvent: () => void;
  createEvent: (eventBody: ZetkinEventPostBody) => Promise<ZetkinEvent>;
  deleteEvent: () => void;
  publishEvent: () => void;
  restoreEvent: () => void;
  setPublished: (published: string | null) => void;
  setTitle: (title: string) => void;
  setType: (id: number | null) => void;
  updateEvent: (data: ZetkinEventPatchBody) => void;
};

export default function useEventMutations(
  orgId: number,
  eventId: number
): useEventMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const createEvent = async (
    eventBody: ZetkinEventPostBody
  ): Promise<ZetkinEvent> => {
    dispatch(eventCreate());
    const event = await apiClient.post<ZetkinEvent, ZetkinEventPostBody>(
      `/api/orgs/${orgId}/${
        eventBody.campaign_id ? `campaigns/${eventBody.campaign_id}/` : ''
      }actions`,
      eventBody
    );
    dispatch(eventCreated(event));
    return event;
  };

  const cancelEvent = () => {
    updateEvent({
      cancelled: new Date().toISOString(),
    });
  };

  const deleteEvent = async () => {
    await apiClient.delete(`/api/orgs/${orgId}/actions/${eventId}`);
    dispatch(eventDeleted(eventId));
  };

  const publishEvent = () => {
    updateEvent({
      cancelled: null,
      published: new Date().toISOString(),
    });
  };

  const restoreEvent = () => {
    updateEvent({
      cancelled: null,
    });
  };

  const setPublished = (published: string | null) => {
    updateEvent({
      cancelled: null,
      published: published ? new Date(published).toISOString() : null,
    });
  };

  const setTitle = (title: string) => {
    updateEvent({ title });
  };

  const setType = (id: number | null) => {
    updateEvent({
      activity_id: id,
    });
  };

  const updateEvent = (data: ZetkinEventPatchBody) => {
    dispatch(eventUpdate([eventId, Object.keys(data)]));
    apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        dispatch(eventUpdated(event));
      });
  };

  return {
    cancelEvent,
    createEvent,
    deleteEvent,
    publishEvent,
    restoreEvent,
    setPublished,
    setTitle,
    setType,
    updateEvent,
  };
}
