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
  numAvailParticipants: number;
  numCancelledParticipants: number;
  numConfirmedParticipants: number;
  numNoshowParticipants: number;
  numRemindedParticipants: number;
  numSignedUpParticipants: number;
  respondentsFuture: IFuture<ZetkinEventResponse[]>;
  unverifiedSignedUpParticipants: EventSignupModelType[];
  verifiedParticipantsFuture: IFuture<ZetkinEventParticipant[]>;
  verifiedSignedUpParticipants: ZetkinEventResponse[];
};

export default function useEventParticipants(
  orgId: number,
  eventId: number
): useEventParticipantsReturn {
  const apiClient = useApiClient();
  const participantsState = useAppSelector((state) => state.events);
  const dispatch = useAppDispatch();

  const verifiedParticipantList =
    participantsState.participantsByEventId[eventId];
  const respondentsList = participantsState.respondentsByEventId[eventId];

  const unverifiedSignedUpParticipantsList =
    participantsState.unverifiedParticipantsByEventId[eventId];

  const verifiedParticipantsFuture = loadListIfNecessary(
    verifiedParticipantList,
    dispatch,
    {
      actionOnLoad: () => participantsLoad(eventId),
      actionOnSuccess: (participants) =>
        participantsLoaded([eventId, participants]),
      loader: () =>
        apiClient.get<ZetkinEventParticipant[]>(
          `/api/orgs/${orgId}/actions/${eventId}/participants`
        ),
    }
  );

  const unverifiedSignedUpParticipantsFuture = loadListIfNecessary(
    unverifiedSignedUpParticipantsList,
    dispatch,
    {
      actionOnLoad: () => unverifiedParticipantsLoad(eventId),
      actionOnSuccess: (unverifiedSignedUpParticipants) =>
        unverifiedParticipantsLoaded([eventId, unverifiedSignedUpParticipants]),
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

  const numAvailParticipants = verifiedParticipantsFuture.data
    ? verifiedParticipantsFuture.data.filter((p) => p.cancelled == null).length
    : 0;

  const unverifiedSignedUpParticipants =
    unverifiedSignedUpParticipantsFuture.data ?? [];

  const verifiedSignedUpParticipants =
    respondentsFuture.data?.filter(
      (r) => !verifiedParticipantsFuture.data?.some((p) => p.id === r.id)
    ) || [];

  const numSignedUpParticipants =
    verifiedSignedUpParticipants.length + unverifiedSignedUpParticipants.length;

  const bookedParticipants =
    verifiedParticipantsFuture?.data?.filter((p) => p.cancelled == null) ?? [];

  const cancelledParticipants =
    verifiedParticipantsFuture?.data?.filter((p) => p.cancelled != null) ?? [];

  const numCancelledParticipants =
    verifiedParticipantsFuture.data?.filter((p) => p.cancelled != null)
      .length ?? 0;

  const numConfirmedParticipants = verifiedParticipantsFuture.data
    ? verifiedParticipantsFuture.data.filter((p) => p.attended != null).length
    : 0;

  const numNoshowParticipants = verifiedParticipantsFuture.data
    ? verifiedParticipantsFuture.data.filter((p) => p.noshow != null).length
    : 0;

  const numRemindedParticipants =
    verifiedParticipantsFuture.data?.filter(
      (p) => p.reminder_sent != null && p.cancelled == null
    ).length ?? 0;

  return {
    bookedParticipants,
    cancelledParticipants,
    numAvailParticipants,
    numCancelledParticipants,
    numConfirmedParticipants,
    numNoshowParticipants,
    numRemindedParticipants,
    numSignedUpParticipants,
    respondentsFuture,
    unverifiedSignedUpParticipants,
    verifiedParticipantsFuture,
    verifiedSignedUpParticipants,
  };
}
