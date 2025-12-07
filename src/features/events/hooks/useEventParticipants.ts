import {
  participantsLoad,
  participantsLoaded,
  respondentsLoad,
  respondentsLoaded,
} from '../store';
import { useApiClient, useAppSelector } from 'core/hooks';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';
import useRemoteList from 'core/hooks/useRemoteList';

type useEventParticipantsReturn = {
  bookedParticipants: ZetkinEventParticipant[];
  cancelledParticipants: ZetkinEventParticipant[];
  numAvailParticipants: number;
  numCancelledParticipants: number;
  numConfirmedParticipants: number;
  numNoshowParticipants: number;
  numRemindedParticipants: number;
  numSignedParticipants: number;
  participants: ZetkinEventParticipant[];
  pendingSignUps: ZetkinEventResponse[];
  respondents: ZetkinEventResponse[];
};

export default function useEventParticipants(
  orgId: number,
  eventId: number
): useEventParticipantsReturn {
  const apiClient = useApiClient();
  const participantsState = useAppSelector((state) => state.events);

  const list = participantsState.participantsByEventId[eventId];
  const respondentsList = participantsState.respondentsByEventId[eventId];

  const participants = useRemoteList(list, {
    actionOnLoad: () => participantsLoad(eventId),
    actionOnSuccess: (participants) =>
      participantsLoaded([eventId, participants]),
    loader: () =>
      apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${orgId}/actions/${eventId}/participants`
      ),
  });

  const respondents = useRemoteList(respondentsList, {
    actionOnLoad: () => respondentsLoad(eventId),
    actionOnSuccess: (respondents) => respondentsLoaded([eventId, respondents]),
    loader: () =>
      apiClient.get<ZetkinEventResponse[]>(
        `/api/orgs/${orgId}/actions/${eventId}/responses`
      ),
  });

  const numAvailParticipants = participants.filter(
    (p) => p.cancelled == null
  ).length;

  const pendingSignUps = respondents.filter(
    (r) => !participants.some((p) => p.id === r.id)
  );

  const bookedParticipants = participants.filter((p) => p.cancelled == null);

  const cancelledParticipants = participants.filter((p) => p.cancelled != null);

  const numCancelledParticipants = participants.filter(
    (p) => p.cancelled != null
  ).length;

  const numConfirmedParticipants = participants.filter(
    (p) => p.attended != null
  ).length;

  const numNoshowParticipants = participants.filter(
    (p) => p.noshow != null
  ).length;

  const numRemindedParticipants = participants.filter(
    (p) => p.reminder_sent != null && p.cancelled == null
  ).length;

  const numSignedParticipants = respondents.filter(
    (r) => !participants.some((p) => p.id === r.id)
  ).length;

  return {
    bookedParticipants,
    cancelledParticipants,
    numAvailParticipants,
    numCancelledParticipants,
    numConfirmedParticipants,
    numNoshowParticipants,
    numRemindedParticipants,
    numSignedParticipants,
    participants,
    pendingSignUps,
    respondents,
  };
}
