import { userResponseAdded, userResponseDeleted } from 'features/events/store';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

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
        const response = await apiClient.put<{ action: ZetkinEvent }>(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${participantId}`
        );
        dispatch(userResponseAdded(response.action));
      }
    },
    async undoSignup() {
      if (participantId) {
        await apiClient.delete(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${participantId}`
        );
      }
      dispatch(userResponseDeleted(eventId));
    },
  };
}
