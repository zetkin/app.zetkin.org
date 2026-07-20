import { Call } from '../apiTypes';
import { PromiseFuture } from 'core/caching/futures';
import { callUpdate, callUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseCallReturn {
  setOrganizerActionNeeded: (orgId: number, callId: number) => void;
  setOrganizerActionTaken: (orgId: number, callId: number) => void;
}

export default function useCall(): UseCallReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const updateCall = (orgId: number, callId: number, data: Partial<Call>) => {
    const mutatingAttributes = Object.keys(data);

    dispatch(callUpdate([callId, mutatingAttributes]));
    const promise = apiClient
      .patch<Call>(`/api/orgs/${orgId}/calls/${callId}`, data)
      .then((data) => {
        dispatch(callUpdated([data, mutatingAttributes]));
        return data;
      });
    return new PromiseFuture(promise);
  };

  const setOrganizerActionNeeded = (orgId: number, callId: number) => {
    updateCall(orgId, callId, { organizer_action_taken: false });
  };

  const setOrganizerActionTaken = (orgId: number, callId: number) => {
    updateCall(orgId, callId, { organizer_action_taken: true });
  };

  return { setOrganizerActionNeeded, setOrganizerActionTaken };
}
