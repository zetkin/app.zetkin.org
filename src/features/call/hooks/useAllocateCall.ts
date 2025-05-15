import { useRouter } from 'next/navigation';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { allocateNewCallLoad, allocateNewCallLoaded } from '../store';
import { ZetkinCall } from '../types';

export default function useAllocateCall(
  orgId: number,
  assignmentId: number
): { allocateCall: () => Promise<ZetkinCall | null> } {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const allocateCall = async (): Promise<ZetkinCall | null> => {
    dispatch(allocateNewCallLoad());
    try {
      const response = await apiClient.post<ZetkinCall>(
        `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
        {}
      );
      dispatch(allocateNewCallLoaded(response));
      return response;
    } catch (error) {
      router.push(`/call/${assignmentId}`);
      return null;
    }
  };
  return { allocateCall };
}
