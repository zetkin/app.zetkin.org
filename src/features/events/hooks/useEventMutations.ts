import { ZetkinEvent } from 'utils/types/zetkin';
import { eventDeleted, eventUpdate, eventUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export type ZetkinEventPatchBody = Partial<
  Omit<
    ZetkinEvent,
    'id' | 'activity' | 'campaign' | 'location' | 'organization'
  >
> & {
  activity_id?: number | null;
  campaign_id?: number;
  cancelled?: string | null;
  contact_id?: number | null;
  location_id?: number | null;
  organization_id?: number;
  published?: string | null;
};

export type ZetkinEventPostBody = ZetkinEventPatchBody;

type useEventMutationsReturn = {
  cancelEvent: (eventId: number) => void;
  deleteEvent: (eventId: number) => void;
  publishEvent: (eventId: number) => void;
  restoreEvent: (eventId: number) => void;
  setPublished: (eventId: number, published: string | null) => void;
  setTitle: (eventId: number, title: string) => void;
  setType: (eventId: number, id: number | null) => void;
  updateEvent: (eventId: number, data: ZetkinEventPatchBody) => void;
};

export default function useEventMutations(
  orgId: number
): useEventMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const cancelEvent = (eventId: number) => {
    updateEvent(eventId, {
      cancelled: new Date().toISOString(),
    });
  };

  const deleteEvent = async (eventId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/actions/${eventId}`);
    dispatch(eventDeleted(eventId));
  };

  const publishEvent = (eventId: number) => {
    updateEvent(eventId, {
      cancelled: null,
      published: new Date().toISOString(),
    });
  };

  const restoreEvent = (eventId: number) => {
    updateEvent(eventId, {
      cancelled: null,
    });
  };

  const setPublished = (eventId: number, published: string | null) => {
    updateEvent(eventId, {
      cancelled: null,
      published: published ? new Date(published).toISOString() : null,
    });
  };

  const setTitle = (eventId: number, title: string) => {
    updateEvent(eventId, { title });
  };

  const setType = (eventId: number, id: number | null) => {
    updateEvent(eventId, {
      activity_id: id,
    });
  };

  const updateEvent = (eventId: number, data: ZetkinEventPatchBody) => {
    dispatch(eventUpdate([eventId, Object.keys(data)]));
    apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        dispatch(eventUpdated(event));
      });
  };

  return {
    cancelEvent,
    deleteEvent,
    publishEvent,
    restoreEvent,
    setPublished,
    setTitle,
    setType,
    updateEvent,
  };
}
