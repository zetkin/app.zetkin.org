import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  allocateCallError,
  allocateNewCall,
  newCallAllocated,
  updateLaneStep,
} from '../store';
import { LaneStep, ZetkinCall } from '../types';

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
  const error = useAppSelector((state) => state.call.queueHasError);
  const isLoading = useAppSelector(
    (state) => state.call.outgoingCalls.isLoading
  );

  const allocateCall = async (): Promise<void | SerializedError> => {
    dispatch(allocateNewCall());
    try {
      const call = await apiClient.post<ZetkinCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      );
      dispatch(newCallAllocated(call));
      dispatch(updateLaneStep(LaneStep.PREPARE));
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Empty queue error');
      const serialized = {
        message: error.message,
        name: error.name,
      };
      dispatch(allocateCallError(serialized));
      dispatch(updateLaneStep(LaneStep.STATS));
      return error;
    }
  };

  return {
    allocateCall,
    error,
    isLoading,
  };
}
