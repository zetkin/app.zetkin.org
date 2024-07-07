import { participantOpAdd } from '../store';
import { ParticipantOpKind } from '../types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

type UseMoveParticipantsReturn = {
  affectedParticipantIds: number[];
  moveFrom: (eventId: number, personId: number) => void;
  moveTo: (eventId: number, personId: number) => void;
};

export default function useParticipantPool(): UseMoveParticipantsReturn {
  const dispatch = useAppDispatch();
  const pendingOps = useAppSelector(
    (state) => state.events.pendingParticipantOps
  );

  return {
    affectedParticipantIds: Array.from(
      new Set(pendingOps.map((op) => op.personId))
    ),
    moveFrom: (eventId, personId) => {
      dispatch(
        participantOpAdd({
          eventId,
          kind: ParticipantOpKind.REMOVE,
          personId,
        })
      );
    },
    moveTo: (eventId, personId) => {
      dispatch(
        participantOpAdd({
          eventId,
          kind: ParticipantOpKind.ADD,
          personId,
        })
      );
    },
  };
}
