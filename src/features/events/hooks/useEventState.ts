import getEventState from '../utils/getEventState';
import useEvent from './useEvent';

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
  const event = useEvent(orgId, eventId);

  if (!event.data) {
    return EventState.UNKNOWN;
  }

  return getEventState(event.data);
}
