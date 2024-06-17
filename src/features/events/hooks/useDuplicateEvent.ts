import useCreateEvent from './useCreateEvent';
import useEvent from './useEvent';
import { ZetkinEventPostBody } from './useEventMutations';

export default function useDuplicateEvent(orgId: number, eventId: number) {
  const createEvent = useCreateEvent(orgId);
  const event = useEvent(orgId, eventId)?.data;

  return () => {
    const duplicateEventPostBody: ZetkinEventPostBody = {
      activity_id: event?.activity?.id,
      end_time: event?.end_time,
      info_text: event?.info_text,
      location_id: event?.location?.id,
      num_participants_required: event?.num_participants_required,
      organization_id: event?.organization.id,
      start_time: event?.start_time,
      title: event?.title,
      url: event?.url,
    };
    if (event?.campaign) {
      duplicateEventPostBody.campaign_id = event?.campaign.id;
    }
    return createEvent(duplicateEventPostBody);
  };
}
