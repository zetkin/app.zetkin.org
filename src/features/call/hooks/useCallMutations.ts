import { useApiClient, useAppDispatch } from 'core/hooks';
import { currentCallDeleted } from '../store';

export default function useCallMutations(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteCall = async (callId: number) => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(currentCallDeleted(callId));
  };

  return { deleteCall };
}
