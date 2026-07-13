import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import { eventResponseAdded, eventResponseRemoved } from '../store';

export default function useEventCallActions(
  orgId: number,
  eventId: number,
  participantId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async signUp() {
      if (participantId) {
        await apiClient.put<{ action: ZetkinEvent }>(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${participantId}`
        );
        dispatch(eventResponseAdded(eventId));
      }
    },
    async undoSignup() {
      if (participantId) {
        await apiClient.delete(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${participantId}`
        );
      }
      dispatch(eventResponseRemoved(eventId));
    },
  };
}
