import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  participantsLoad,
  participantsLoaded,
  respondentsLoad,
  respondentsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

type useEventParticipantsReturn = {
  bookedParticipants: ZetkinEventParticipant[] | [];
  cancelledParticipants: ZetkinEventParticipant[] | [];
  numAvailParticipants: number;
  numCancelledParticipants: number;
  numConfirmedParticipants: number;
  numNoshowParticipants: number;
  numRemindedParticipants: number;
  numSignedParticipants: number;
  participantsFuture: IFuture<ZetkinEventParticipant[]>;
  pendingSignUps: ZetkinEventResponse[] | [];
  respondentsFuture: IFuture<ZetkinEventResponse[]>;
};

export default function useEventParticipants(
  orgId: number,
  eventId: number
): useEventParticipantsReturn {
  const apiClient = useApiClient();
  const participantsState = useAppSelector((state) => state.events);
  const dispatch = useAppDispatch();

  const list = participantsState.participantsByEventId[eventId];
  const respondentsList = participantsState.respondentsByEventId[eventId];

  const participantsFuture = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => participantsLoad(eventId),
    actionOnSuccess: (participants) =>
      participantsLoaded([eventId, participants]),
    loader: () =>
      apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${orgId}/actions/${eventId}/participants`
      ),
  });

  const respondentsFuture = loadListIfNecessary(respondentsList, dispatch, {
    actionOnLoad: () => respondentsLoad(eventId),
    actionOnSuccess: (respondents) => respondentsLoaded([eventId, respondents]),
    loader: () =>
      apiClient.get<ZetkinEventResponse[]>(
        `/api/orgs/${orgId}/actions/${eventId}/responses`
      ),
  });

  const numAvailParticipants = participantsFuture.data
    ? participantsFuture.data.filter((p) => p.cancelled == null).length
    : 0;

  const pendingSignUps =
    respondentsFuture.data?.filter(
      (r) => !participantsFuture.data?.some((p) => p.id === r.id)
    ) || [];

  const bookedParticipants =
    participantsFuture?.data?.filter((p) => p.cancelled == null) ?? [];

  const cancelledParticipants =
    participantsFuture?.data?.filter((p) => p.cancelled != null) ?? [];

  const numCancelledParticipants =
    participantsFuture.data?.filter((p) => p.cancelled != null).length ?? 0;

  const numConfirmedParticipants = participantsFuture.data
    ? participantsFuture.data.filter((p) => p.attended != null).length
    : 0;

  const numNoshowParticipants = participantsFuture.data
    ? participantsFuture.data.filter((p) => p.noshow != null).length
    : 0;

  const numRemindedParticipants =
    participantsFuture.data?.filter(
      (p) => p.reminder_sent != null && p.cancelled == null
    ).length ?? 0;

  const numSignedParticipants =
    respondentsFuture.data?.filter(
      (r) => !participantsFuture.data?.some((p) => p.id === r.id)
    ).length ?? 0;

  return {
    bookedParticipants,
    cancelledParticipants,
    numAvailParticipants,
    numCancelledParticipants,
    numConfirmedParticipants,
    numNoshowParticipants,
    numRemindedParticipants,
    numSignedParticipants,
    participantsFuture,
    pendingSignUps,
    respondentsFuture,
  };
}
