import { useApiClient, useAppDispatch } from 'core/hooks';
import { currentCallDeleted, newCallAllocated } from '../store';
import { ZetkinCall, ZetkinCallPatchBody } from '../types';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(currentCallDeleted(callId));
  };

  const switchCurrentCall = async (call: ZetkinCall) => {
    dispatch(newCallAllocated(call));
  };

  const updateCall = (callId: number, data: ZetkinCallPatchBody) => {
    return apiClient.patch<ZetkinCall, ZetkinCallPatchBody>(
      `/api/orgs/${orgId}/calls/${callId}`,
      data
    );
  };

  return { deleteCall, switchCurrentCall, updateCall };
}
