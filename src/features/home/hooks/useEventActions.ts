import { userResponseAdded, userResponseDeleted } from 'features/events/store';
import useUserMemberships from './useUserMemberships';
import { useApiClient, useAppDispatch } from 'core/hooks';
import { ZetkinEvent, ZetkinPerson } from 'utils/types/zetkin';

function isPerson(obj: Record<string, unknown>): obj is ZetkinPerson {
  return 'first_name' in obj;
}

export default function useEventActions(orgId: number, eventId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const memberships = useUserMemberships();
  const relevantMembership = memberships.find(
    (membership) => membership.organization.id == orgId
  );
  let personId = relevantMembership?.profile.id;

  const requiresConnect = !personId;

  return {
    requiresConnect,
    async signUp() {
      if (requiresConnect) {
        const person = await apiClient.post<Record<string, unknown>>(
          `/api/orgs/${orgId}/join_requests`,
          {}
        );

        if (isPerson(person)) {
          personId = person.id;
        }
      }

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
