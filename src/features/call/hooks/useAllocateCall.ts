import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { allocateCallError, allocateNewCall, newCallAllocated } from '../store';
import { UnfinishedCall } from '../types';

export type SerializedError = {
  message: string;
  name: string;
};

type UseAllocateCallReturn = {
  allocateCall: () => Promise<void | SerializedError>;
  error: SerializedError | null;
  isLoading: boolean;
};

export default function useAllocateCall(
  orgId: number,
  assignmentId: number
): UseAllocateCallReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const queueError = useAppSelector((state) => state.call.queueError);
  const callIsBeingAllocated = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex].callIsBeingAllocated
  );

  const allocateCall = async (): Promise<void | SerializedError> => {
    dispatch(allocateNewCall());
    try {
      const call = await apiClient.post<UnfinishedCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      );
      dispatch(newCallAllocated(call));
    } catch (e) {
      const queueError =
        e instanceof Error ? e : new Error('Empty queue error');
      const serialized = {
        message: queueError.message,
        name: queueError.name,
      };
      dispatch(allocateCallError(serialized));
      return queueError;
    }
  };

  return {
    allocateCall,
    error: queueError,
    isLoading: callIsBeingAllocated,
  };
}
