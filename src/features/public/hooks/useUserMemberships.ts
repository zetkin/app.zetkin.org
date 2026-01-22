import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import { membershipsLoad, membershipsLoaded } from 'features/user/store';
import { ZetkinMembership } from 'utils/types/zetkin';

export default function useUserMemberships() {
  const apiClient = useApiClient();
  const list = useAppSelector((state) => state.user.membershipList);
  return useRemoteList(list, {
    actionOnLoad: () => membershipsLoad(),
    actionOnSuccess: (data) => membershipsLoaded(data),
    loader: () =>
      apiClient.get<ZetkinMembership[]>('/api/users/me/memberships'),
  });
}
