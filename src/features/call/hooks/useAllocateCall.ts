import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  allocateCallError,
  allocateNewCallLoad,
  allocateNewCallLoaded,
} from '../store';
import { ZetkinCall } from '../types';

type UseAllocateCallReturn = {
  allocateCall: () => Promise<void | unknown>;
  error: unknown;
};

export default function useAllocateCall(
  orgId: number,
  assignmentId: number
): UseAllocateCallReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.call.queueHasError);

  const allocateCall = async (): Promise<void | unknown> => {
    dispatch(allocateNewCallLoad());
    try {
      const call = await apiClient.post<ZetkinCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      );
      dispatch(allocateNewCallLoaded(call));
    } catch (e) {
      dispatch(allocateCallError([assignmentId, e]));
      return e;
    }
  };

  return {
    allocateCall,
    error,
  };
}
