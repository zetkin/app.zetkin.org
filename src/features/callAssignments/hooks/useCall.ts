import { Call } from '../apiTypes';
import { callUpdate, callUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

export default function useCall() {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return async (orgId: number, callId: number, data: Partial<Call>) => {
    const mutatingAttributes = Object.keys(data);

    dispatch(callUpdate([callId, mutatingAttributes]));
    const updatedCall = await apiClient.patch<Call>(
      `/api/orgs/${orgId}/calls/${callId}`,
      data
    );
    dispatch(callUpdated([updatedCall, mutatingAttributes]));

    return updatedCall;
  };
}
