import theme from 'theme';
import useEventData from './useEventData';
import useEventParticipants from './useEventParticipants';

export default function useParticipantStatus(
  orgId: number,
  eventId: number
): string {
  const { numAvailParticipants } = useEventParticipants(orgId, eventId);
  const event = useEventData(orgId, eventId);
  const reqParticipants = event.data?.num_participants_required ?? 0;
  const diff = reqParticipants - numAvailParticipants;

  if (diff <= 0) {
    return theme.palette.statusColors.green;
  } else if (diff === 1) {
    return theme.palette.statusColors.orange;
  } else {
    return theme.palette.statusColors.red;
  }
}
