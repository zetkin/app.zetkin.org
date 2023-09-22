import { Call } from '../apiTypes';
import { PromiseFuture } from 'core/caching/futures';
import { useApiClient } from 'core/hooks';
import { useStore } from 'react-redux';
import { callUpdate, callUpdated } from '../store';

interface UseCallReturn {
  setOrganizerActionNeeded: (callId: number) => void;
  setOrganizerActionTaken: (callId: number) => void;
}

export default function useCall(orgId: number): UseCallReturn {
  const store = useStore();
  const apiClient = useApiClient();

  const updateCall = (callId: number, data: Partial<Call>) => {
    const mutatingAttributes = Object.keys(data);

    store.dispatch(callUpdate([callId, mutatingAttributes]));
    const promise = apiClient
      .patch<Call>(`/api/orgs/${orgId}/calls/${callId}`, data)
      .then((data) => {
        store.dispatch(callUpdated([data, mutatingAttributes]));
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
