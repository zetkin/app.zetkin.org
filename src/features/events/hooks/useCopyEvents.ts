import copyEvents from '../rpc/copyEvents';
import getNewEventTimes from '../utils/getNewEventTimes';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventsCreate, eventsCreated, resetSelection } from '../store';
import {
  useApiClient,
  useAppDispatch,
  useNumericRouteParams,
} from 'core/hooks';

const makeZetkinEventPatchBody = (e: ZetkinEvent) => {
  return {
    activity_id: e.activity?.id,
    campaign_id: e.campaign?.id,
    cancelled: e.cancelled,
    contact_id: e.contact?.id,
    cover_file_id: e.cover_file?.id,
    end_time: e.end_time,
    info_text: e.info_text,
    location_id: e.location?.id,
    num_participants_available: e.num_participants_available,
    num_participants_required: e.num_participants_required,
    organization_id: e.organization.id,
    start_time: e.start_time,
    title: e.title,
    url: e.url,
  };
};

export default function useCopyEvents() {
  const { orgId } = useNumericRouteParams();
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const duplicate = async (events: ZetkinEvent[]) => {
    const eventsToDuplicate = events.map((e) => makeZetkinEventPatchBody(e));

    dispatch(eventsCreate);
    const duplicatedEvents = await apiClient.rpc(copyEvents, {
      events: eventsToDuplicate,
      orgId: orgId.toString(),
    });
    dispatch(eventsCreated(duplicatedEvents));
    dispatch(resetSelection());
  };

  const createShift = async (events: ZetkinEvent[]) => {
    const shiftsToCreate = events.map((event) => {
      const firstShiftStart = new Date(event.start_time);
      const firstShiftEnd = new Date(event.end_time);

      const shiftLength = firstShiftEnd.getTime() - firstShiftStart.getTime();
      const endTime = new Date(firstShiftEnd.getTime() + shiftLength);
      return makeZetkinEventPatchBody({
        ...event,
        end_time: endTime.toISOString(),
        start_time: firstShiftEnd.toISOString(),
      });
    });

    dispatch(eventsCreate);
    const createdShifts = await apiClient.rpc(copyEvents, {
      events: shiftsToCreate,
      orgId: orgId.toString(),
    });
    dispatch(eventsCreated(createdShifts));
    dispatch(resetSelection());
  };

  const copyToLaterDate = async (events: ZetkinEvent[], offset: number) => {
    const eventsToCreate = events.map((event) => {
      const { newEndTime: newEventEndTime, newStartTime: newEventStartTime } =
        getNewEventTimes(event, offset);

      return makeZetkinEventPatchBody({
        ...event,
        end_time: newEventEndTime.toISOString(),
        start_time: newEventStartTime.toISOString(),
      });
    });

    dispatch(eventsCreate);
    const createdEvents = await apiClient.rpc(copyEvents, {
      events: eventsToCreate,
      orgId: orgId.toString(),
    });
    dispatch(eventsCreated(createdEvents));
    dispatch(resetSelection());
  };

  return {
    copyToLaterDate,
    createShift,
    duplicate,
  };
}
