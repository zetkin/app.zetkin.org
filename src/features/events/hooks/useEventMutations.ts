import { ZetkinEvent } from 'utils/types/zetkin';
import { eventDeleted, eventUpdate, eventUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export type ZetkinEventPatchBody = Partial<
  Omit<
    ZetkinEvent,
    'id' | 'activity' | 'campaign' | 'cover_file' | 'location' | 'organization'
  >
> & {
  activity_id?: number | null;
  campaign_id?: number;
  cancelled?: string | null;
  contact_id?: number | null;
  cover_file_id?: number | null;
  location_id?: number | null;
  organization_id?: number;
  published?: string | null;
};

export type ZetkinEventPostBody = ZetkinEventPatchBody;

type useEventMutationsReturn = {
  cancelEvent: () => void;
  changeEventCampaign: (campaignId: number) => Promise<void>;
  deleteEvent: () => void;
  publishEvent: () => void;
  restoreEvent: () => void;
  setPublished: (published: string | null) => void;
  setTitle: (title: string) => void;
  setType: (id: number | null) => void;
  updateEvent: (data: ZetkinEventPatchBody) => Promise<void>;
};

export default function useEventMutations(
  orgId: number,
  eventId: number
): useEventMutationsReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

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

  const changeEventCampaign = (campaignId: number) => {
    return updateEvent({
      campaign_id: campaignId,
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
    return apiClient
      .patch<ZetkinEvent>(`/api/orgs/${orgId}/actions/${eventId}`, data)
      .then((event) => {
        dispatch(eventUpdated(event));
      });
  };

  return {
    cancelEvent,
    changeEventCampaign,
    deleteEvent,
    publishEvent,
    restoreEvent,
    setPublished,
    setTitle,
    setType,
    updateEvent,
  };
}
