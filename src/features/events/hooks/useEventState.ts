import getEventState from '../utils/getEventState';
import useEventData from './useEventData';

export enum EventState {
  CANCELLED = 'cancelled',
  DRAFT = 'draft',
  ENDED = 'ended',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default function useEventState(
  orgId: number,
  eventId: number
): EventState {
  const event = useEventData(orgId, eventId);

  if (!event.data) {
    return EventState.UNKNOWN;
  }

  return getEventState(event.data);
}
