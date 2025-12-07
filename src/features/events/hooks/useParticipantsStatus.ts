import oldTheme from 'theme';
import useEvent from './useEvent';
import useEventParticipants from './useEventParticipants';

export default function useParticipantStatus(
  orgId: number,
  eventId: number
): string {
  const { numAvailParticipants } = useEventParticipants(orgId, eventId);
  const event = useEvent(orgId, eventId);
  const reqParticipants = event?.num_participants_required ?? 0;
  const diff = reqParticipants - numAvailParticipants;

  if (diff <= 0) {
    return oldTheme.palette.statusColors.green;
  } else if (diff === 1) {
    return oldTheme.palette.statusColors.orange;
  } else {
    return oldTheme.palette.statusColors.red;
  }
}
