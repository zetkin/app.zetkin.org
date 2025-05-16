import { useRouter } from 'next/navigation';

import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import {
  allocateCallError,
  allocateNewCallLoad,
  allocateNewCallLoaded,
} from '../store';
import { ZetkinCall } from '../types';
import { loadListIfNecessary } from 'core/caching/cacheUtils';

type UseAllocateCallReturn = {
  allocateCall: () => Promise<ZetkinCall | null>;
  error: unknown;
};

export default function useAllocateCall(
  orgId: number,
  assignmentId: number
): UseAllocateCallReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const list = useAppSelector((state) => state.call.outgoingCalls);
  const error = useAppSelector((state) => state.call.outgoingCalls.error);

  const allocateCall = async (): Promise<ZetkinCall | null> => {
    const future = loadListIfNecessary(list, dispatch, {
      actionOnError: (error) => {
        router.push(`/call/${assignmentId}`);
        return allocateCallError([assignmentId, error]);
      },
      actionOnLoad: () => allocateNewCallLoad(),
      actionOnSuccess: ([call]: ZetkinCall[]) => allocateNewCallLoaded(call),
      loader: () =>
        apiClient
          .post<ZetkinCall>(
            `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
            {}
          )
          .then((call) => [call]),
    });

    return future.data ? future.data[0] : null;
  };

  return {
    allocateCall,
    error,
  };
}
