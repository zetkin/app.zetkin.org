import moveParticipants from '../rpc/moveParticipants';
import { participantOpsClear, participantOpsExecuted } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type UseParticipantPoolApiReturn = {
  discard: () => void;
  execute: () => Promise<void>;
};

export default function useParticipantPoolApi(
  orgId: number
): UseParticipantPoolApiReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const ops = useAppSelector((state) => state.events.pendingParticipantOps);

  function discard() {
    dispatch(participantOpsClear());
  }

  async function execute() {
    await apiClient.rpc(moveParticipants, { ops, orgId });
    dispatch(participantOpsExecuted());
  }

  return {
    discard,
    execute,
  };
}
