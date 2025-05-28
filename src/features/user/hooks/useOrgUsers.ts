import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinOrgUser } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { orgUsersLoad, orgUsersLoaded } from '../store';

export default function useOrgUsers(orgId: number): ZetkinOrgUser[] {
  const apiClient = useApiClient();
  const userList = useAppSelector((state) => state.user.orgUserList);
  return useRemoteList(userList, {
    actionOnLoad: () => orgUsersLoad(),
    actionOnSuccess: (data) => orgUsersLoaded(data),
    // TODO: Use search API instead of loading all users
    loader: async () => {
      const users: ZetkinOrgUser[] = [];

      const BATCH_SIZE = 100;

      async function loadNextBatch(page: number = 1) {
        const batchUsers = await apiClient.get<ZetkinOrgUser[]>(
          `/api2/orgs/${orgId}/users?size=${BATCH_SIZE}&page=${page}`
        );

        users.push(...batchUsers);

        if (batchUsers.length >= BATCH_SIZE) {
          await loadNextBatch(page + 1);
        }
      }

      await loadNextBatch();

      return users;
    },
  });
}
