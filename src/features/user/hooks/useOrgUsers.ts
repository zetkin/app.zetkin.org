import useRemoteList from 'core/hooks/useRemoteList';
import { ZetkinOrgUser } from '../types';
import { useApiClient, useAppSelector } from 'core/hooks';
import { usersLoad, usersLoaded } from '../store';

export default function useOrgUsers(orgId: number): ZetkinOrgUser[] {
  const apiClient = useApiClient();
  const userList = useAppSelector((state) => state.user.orgUserList);
  return useRemoteList(userList, {
    actionOnLoad: () => usersLoad(),
    actionOnSuccess: (data) => usersLoaded(data),
    loader: () => apiClient.get<ZetkinOrgUser[]>(`/api2/orgs/${orgId}/users`),
  });
}
