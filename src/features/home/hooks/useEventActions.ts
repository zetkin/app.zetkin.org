import { userResponseAdded, userResponseDeleted } from 'features/events/store';
import useUserMemberships from './useUserMemberships';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';

export default function useEventActions(orgId: number, eventId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const memberships = useUserMemberships();
  const relevantMembership = memberships.find(
    (membership) => membership.organization.id == orgId
  );
  const personId = relevantMembership?.profile.id;

  return {
    async signUp() {
      if (personId) {
        const response = await apiClient.put<{ action: ZetkinEvent }>(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${personId}`
        );
        dispatch(userResponseAdded(response.action));
      }
    },
    async undoSignup() {
      if (personId) {
        await apiClient.delete(
          `/api/orgs/${orgId}/actions/${eventId}/responses/${personId}`
        );
      }
      dispatch(userResponseDeleted(eventId));
    },
  };
}
