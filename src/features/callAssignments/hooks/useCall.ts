import { Call } from '../apiTypes';
import { PromiseFuture } from 'core/caching/futures';
import { callUpdate, callUpdated } from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

interface UseCallReturn {
  setOrganizerActionNeeded: (callId: number) => void;
  setOrganizerActionTaken: (callId: number) => void;
}

export default function useCall(orgId: number): UseCallReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const updateCall = (callId: number, data: Partial<Call>) => {
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

  const setOrganizerActionNeeded = (callId: number) => {
    updateCall(callId, { organizer_action_taken: false });
  };

  const setOrganizerActionTaken = (callId: number) => {
    updateCall(callId, { organizer_action_taken: true });
  };

  return { setOrganizerActionNeeded, setOrganizerActionTaken };
}
