import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEventParticipant } from 'utils/types/zetkin';
import { ParticipantOpKind, ParticipantWithPoolState } from '../types';
import { participantsLoad, participantsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type UseEventParticipantsWithChangesReturn = {
  bookedParticipants: ParticipantWithPoolState[];
};

export default function useEventParticipantsWithChanges(
  orgId: number,
  eventId: number
): UseEventParticipantsWithChangesReturn {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.events.participantsByEventId[eventId]
  );
  const pendingOps = useAppSelector(
    (state) => state.events.pendingParticipantOps
  );
  const dispatch = useAppDispatch();

  const participantsFuture = loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => participantsLoad(eventId),
    actionOnSuccess: (participants) =>
      participantsLoaded([eventId, participants]),
    loader: () =>
      apiClient.get<ZetkinEventParticipant[]>(
        `/api/orgs/${orgId}/actions/${eventId}/participants`
      ),
  });

  return {
    bookedParticipants:
      participantsFuture.data?.map((person) => {
        const movedAway = pendingOps.some(
          (op) =>
            op.eventId == eventId &&
            op.personId == person.id &&
            op.kind == ParticipantOpKind.REMOVE
        );

        return {
          person,
          status: movedAway ? 'removed' : 'booked',
        };
      }) ?? [],
  };
}
