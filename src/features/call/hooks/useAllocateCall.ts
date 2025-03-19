import { useApiClient, useAppDispatch } from 'core/hooks';
import { currentCallLoad, currentCallLoaded } from '../store';
import { ZetkinCall } from '../types';

export default function useAllocateCall(
  orgId: number,
  assignmentId: number
): { allocateCall: () => Promise<ZetkinCall> } {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const allocateCall = async (): Promise<ZetkinCall> => {
    dispatch(currentCallLoad());
    const response = await apiClient.post<ZetkinCall>(
      `/api/orgs/${orgId}/call_assignments/${assignmentId}/queue/head`,
      {}
    );
    dispatch(currentCallLoaded(response));

    return response;
  };

  return { allocateCall };
}
