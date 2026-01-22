import useRemoteItem from 'core/hooks/useRemoteItem';
import { ZetkinOrgUser } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { orgUserLoad, orgUserLoaded } from '../store';

export default function useOrgUser(
  orgId: number,
  userId: number
): ZetkinOrgUser {
  const apiClient = useApiClient();
  const userItem = useAppSelector((state) =>
    state.user.orgUserList.items.find((item) => item.id === userId)
  );

  const url = `/api2/orgs/${orgId}/users/${userId}`;

  return useRemoteItem(userItem, {
    actionOnLoad: () => orgUserLoad(userId),
    actionOnSuccess: (data) => orgUserLoaded([userId, data]),
    cacheKey: url,
    loader: () => apiClient.get<ZetkinOrgUser>(url),
  });
}
