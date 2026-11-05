import { useCallback, useMemo } from 'react';

import { useApiClient, useAppDispatch } from 'core/hooks';
import { userMembershipsLoaded } from 'features/manage/store';
import { ZetkinMembership, ZetkinRole } from 'utils/types/zetkin';

export default function useUserMembershipActions(userId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

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
    () => ({ disconnectFromOrg, updateUserRole }),
    [disconnectFromOrg, updateUserRole]
  );
}
