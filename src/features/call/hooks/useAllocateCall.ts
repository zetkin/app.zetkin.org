import { useRouter } from 'next/navigation';

import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  allocateCallError,
  allocateNewCallLoad,
  allocateNewCallLoaded,
} from '../store';
import { ZetkinCall } from '../types';

type UseAllocateCallReturn = {
  allocateCall: () => Promise<void>;
  error: unknown;
};

export default function useAllocateCall(
  orgId: number,
  assignmentId: number
): UseAllocateCallReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const error = useAppSelector((state) => state.call.outgoingCalls.error);

  const allocateCall = async (): Promise<void> => {
    dispatch(allocateNewCallLoad());
    try {
      const call = await apiClient.post<ZetkinCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      );

      dispatch(allocateNewCallLoaded(call));
    } catch (e) {
      dispatch(allocateCallError([assignmentId, e]));
      router.push(`/call/${assignmentId}`);
    }
  };

  return {
    allocateCall,
    error,
  };
}
