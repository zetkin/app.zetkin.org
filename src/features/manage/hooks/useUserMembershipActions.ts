import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { userMembershipsLoaded } from 'features/manage/store';
import { ZetkinMembership, ZetkinRole } from 'utils/types/zetkin';

export default function useUserMembershipActions(userId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  const connectToOrg = useCallback(
    async (orgId: number) => {
      await apiClient.post(`/api/orgs/${orgId}/join_requests`, {
        user_id: userId,
      });
      const memberships = await apiClient.get<ZetkinMembership[]>(
        `/api/users/${userId}/memberships`
      );
      const membership =
        memberships.find((m) => m.organization.id === orgId) || null;
      if (membership) {
        try {
          await apiClient.put(`/api/users/${userId}/following/${orgId}`, {
            follow: true,
          });
          membership.follow = true;
        } catch {
          // follow update errors ignored
        }
      }
      dispatch(userMembershipsLoaded([userId, memberships]));
    },
    [apiClient, dispatch, userId]
  );

  const disconnectFromOrg = useCallback(
    async (orgId: number, personId: number) => {
      await apiClient.delete(
        `/api/orgs/${orgId}/people/${personId}/connections/${orgId}`
      );
      const memberships = await apiClient.get<ZetkinMembership[]>(
        `/api/users/${userId}/memberships`
      );
      dispatch(userMembershipsLoaded([userId, memberships]));
    },
    [apiClient, dispatch, userId]
  );

  const updateUserRole = useCallback(
    async (orgId: number, personId: number, role: ZetkinRole) => {
      if (role === null) {
        await apiClient.delete(`/api/orgs/${orgId}/officials/${personId}`);
      } else {
        await apiClient.put(`/api/orgs/${orgId}/officials/${personId}`, {
          role: role,
        });
      }
      const memberships = await apiClient.get<ZetkinMembership[]>(
        `/api/users/${userId}/memberships`
      );
      dispatch(userMembershipsLoaded([userId, memberships]));
    },
    [apiClient, dispatch, userId]
  );

  return useMemo(
    () => ({ connectToOrg, disconnectFromOrg, updateUserRole }),
    [connectToOrg, disconnectFromOrg, updateUserRole]
  );
}
