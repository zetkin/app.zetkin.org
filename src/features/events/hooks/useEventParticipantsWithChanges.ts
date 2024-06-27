import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinEventParticipant } from 'utils/types/zetkin';
import { ParticipantOpKind, ParticipantWithPoolState } from '../types';
import { participantsLoad, participantsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type UseEventParticipantsWithChangesReturn = {
  bookedParticipants: ParticipantWithPoolState[];
  numParticipantsAvailable: number;
  numParticipantsRequired: number;
  pendingParticipants: ParticipantWithPoolState[];
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
  const participantsByEventId = useAppSelector(
    (state) => state.events.participantsByEventId
  );
  const event = useAppSelector(
    (state) =>
      state.events.eventList.items.find((item) => item.id == eventId)?.data ??
      null
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

  const bookedParticipants: ParticipantWithPoolState[] = [];
  const pendingParticipants: ParticipantWithPoolState[] = [];
  const addedIds: number[] = [];

  if (participantsFuture.data) {
    const allParticipants: ZetkinEventParticipant[] = [];
    Object.values(participantsByEventId).forEach((list) => {
      list.items.forEach((item) => {
        if (item.data) {
          allParticipants.push(item.data);
        }
      });
    });

    participantsFuture.data.forEach((person) => {
      if (person.cancelled) {
        return;
      }

      const movedAway = pendingOps.some(
        (op) =>
          op.eventId == eventId &&
          op.personId == person.id &&
          op.kind == ParticipantOpKind.REMOVE
      );

      if (movedAway) {
        pendingParticipants.push({
          person,
          status: 'removed',
        });
      } else {
        bookedParticipants.push({
          person,
          status: 'booked',
        });
      }
    });

    pendingOps
      .concat()
      .sort((a, b) => {
        if (a.kind == ParticipantOpKind.ADD) {
          return -1;
        } else if (b.kind == ParticipantOpKind.ADD) {
          return 1;
        } else {
          return 0;
        }
      })
      .forEach((op) => {
        const participant = allParticipants.find((p) => p.id == op.personId);

        if (participant) {
          const addingToThisEvent =
            op.kind == ParticipantOpKind.ADD && op.eventId == eventId;
          const addedPreviously = addedIds.includes(op.personId);
          const removingFromAnotherEvent =
            op.kind == ParticipantOpKind.REMOVE && op.eventId != eventId;
          const alreadyBooked = bookedParticipants.find(
            (p) => p.person.id == op.personId
          );

          if (addingToThisEvent) {
            addedIds.push(op.personId);
            bookedParticipants.push({
              person: participant,
              status: 'added',
            });
          } else if (
            removingFromAnotherEvent &&
            !addedPreviously &&
            !alreadyBooked
          ) {
            pendingParticipants.push({
              person: participant,
              status: 'pending',
            });
          }
        }
      });
  }

  return {
    bookedParticipants,
    numParticipantsAvailable: bookedParticipants.filter(
      (p) => p.status == 'booked' || p.status == 'added'
    ).length,
    numParticipantsRequired: event?.num_participants_required ?? 0,
    pendingParticipants,
  };
}
