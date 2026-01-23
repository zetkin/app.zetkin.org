import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  participantsLoad,
  participantsLoaded,
  respondentsLoad,
  respondentsLoaded,
  unverifiedParticipantsLoad,
  unverifiedParticipantsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';
import { EventSignupModelType } from '../models';

type useEventParticipantsReturn = {
  bookedParticipants: ZetkinEventParticipant[] | [];
  cancelledParticipants: ZetkinEventParticipant[] | [];
  numAllSignedParticipants: number;
  numAvailParticipants: number;
  numCancelledParticipants: number;
  numConfirmedParticipants: number;
  numNoshowParticipants: number;
  numRemindedParticipants: number;
  numSignedParticipants: number;
  numUnverifiedParticipants: number;
  participantsFuture: IFuture<ZetkinEventParticipant[]>;
  pendingSignUps: ZetkinEventResponse[] | [];
  respondentsFuture: IFuture<ZetkinEventResponse[]>;
  unverifiedParticipants: EventSignupModelType[];
  unverifiedParticipantsFuture: IFuture<EventSignupModelType[]>;
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

  const unverifiedParticipantsList =
    participantsState.unverifiedParticipantsByEventId[eventId];

  const participantsFuture = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => participantsLoad(eventId),
    actionOnSuccess: (participants) =>
      participantsLoaded([eventId, participants]),
    loader: () =>
      apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${orgId}/actions/${eventId}/participants`
      ),
  });

  const unverifiedParticipantsFuture = loadListIfNecessary(
    unverifiedParticipantsList,
    dispatch,
    {
      actionOnLoad: () => unverifiedParticipantsLoad(eventId),
      actionOnSuccess: (unverifiedParticipants) =>
        unverifiedParticipantsLoaded([eventId, unverifiedParticipants]),
      loader: async () => {
        const data = await apiClient.get<
          Array<EventSignupModelType & { _id: string }>
        >(`/beta/orgs/${orgId}/events/${eventId}`);
        return data.map(({ _id, ...rest }) => ({
          ...rest,
          id: _id,
        }));
      },
    }
  );

  const respondentsFuture = loadListIfNecessary(respondentsList, dispatch, {
    actionOnLoad: () => respondentsLoad(eventId),
    actionOnSuccess: (respondents) => respondentsLoaded([eventId, respondents]),
    loader: () =>
      apiClient.get<ZetkinEventResponse[]>(
        `/api/orgs/${orgId}/actions/${eventId}/responses`
      ),
  });

  const numUnverifiedParticipants = unverifiedParticipantsFuture.data
    ? unverifiedParticipantsFuture.data.length
    : 0;

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

  const numAllSignedParticipants =
    (respondentsFuture.data?.filter(
      (r) => !participantsFuture.data?.some((p) => p.id === r.id)
    ).length ?? 0) + numUnverifiedParticipants;

  const numSignedParticipants =
    respondentsFuture.data?.filter(
      (r) => !participantsFuture.data?.some((p) => p.id === r.id)
    ).length ?? 0;

  const unverifiedParticipants = unverifiedParticipantsFuture.data ?? [];

  return {
    bookedParticipants,
    cancelledParticipants,
    numAllSignedParticipants,
    numAvailParticipants,
    numCancelledParticipants,
    numConfirmedParticipants,
    numNoshowParticipants,
    numRemindedParticipants,
    numSignedParticipants,
    numUnverifiedParticipants,
    participantsFuture,
    pendingSignUps,
    respondentsFuture,
    unverifiedParticipants,
    unverifiedParticipantsFuture,
  };
}
