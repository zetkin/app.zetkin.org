import { useApiClient, useAppDispatch } from 'core/hooks';
import { currentCallDeleted, currentCallLoaded } from '../store';
import { ZetkinCall } from '../types';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(currentCallDeleted(callId));
  };

  const switchCurrentCall = async (call: ZetkinCall) => {
    dispatch(currentCallLoaded(call));
  };

  return { deleteCall, switchCurrentCall };
}
