import { useDispatch } from 'react-redux';

import copyEvents from '../rpc/copyEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsCreate, eventsCreated, resetSelection } from '../store';
import { useApiClient, useNumericRouteParams } from 'core/hooks';

export default function useCopyEvents() {
  const { orgId } = useNumericRouteParams();
  const apiClient = useApiClient();
  const dispatch = useDispatch();

  const duplicate = async (events: ZetkinEvent[]) => {
    const eventsToDuplicate = events.map((e) => ({
      activity_id: e.activity?.id,
      campaign_id: e.campaign?.id,
      cancelled: e.cancelled,
      contact_id: e.contact?.id,
      end_time: e.end_time,
      info_text: e.info_text,
      location_id: e.location?.id,
      num_participants_available: e.num_participants_available,
      num_participants_required: e.num_participants_required,
      organization_id: e.organization.id,
      start_time: e.start_time,
      title: e.title,
      url: e.url,
    }));

    dispatch(eventsCreate);
    const duplicatedEvents = await apiClient.rpc(copyEvents, {
      events: eventsToDuplicate,
      orgId: orgId.toString(),
    });
    dispatch(eventsCreated(duplicatedEvents));
    dispatch(resetSelection());
  };
  return {
    duplicate,
  };
}
