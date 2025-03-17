import { useApiClient, useAppDispatch } from 'core/hooks';
import { currentCallDeleted } from '../store';

export default function useCallMutations(callId: number, orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const deleteCall = async () => {
    await apiClient.delete(`/api/orgs/${orgId}/calls/${callId}`);
    dispatch(currentCallDeleted());
  };

  return deleteCall;
}
