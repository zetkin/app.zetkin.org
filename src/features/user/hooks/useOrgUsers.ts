import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinOrgUser } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { orgUsersLoad, orgUsersLoaded } from '../store';
import { fetchAllPaginated } from 'utils/fetchAllPaginated';

export default function useOrgUsers(orgId: number): ZetkinOrgUser[] {
  const apiClient = useApiClient();
  const userList = useAppSelector((state) => state.user.orgUserList);
  return useRemoteList(userList, {
    actionOnLoad: () => orgUsersLoad(),
    actionOnSuccess: (data) => orgUsersLoaded(data),
    cacheKey: `org-users-${orgId}`,
    // TODO: Use search API instead of loading all users
    loader: async () => {
      return await fetchAllPaginated<ZetkinOrgUser>((page) =>
        apiClient.get(`/api2/orgs/${orgId}/users?size=100&page=${page}`)
      );
    },
  });
}
