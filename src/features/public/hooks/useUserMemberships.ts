import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import {
  userMembershipsLoad,
  userMembershipsLoaded,
} from 'features/organizations/store';
import { ZetkinMembership } from 'utils/types/zetkin';

export default function useUserMemberships() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.organizations.userMembershipList
  );
  return useRemoteList(list, {
    actionOnLoad: () => userMembershipsLoad(),
    actionOnSuccess: (data) => userMembershipsLoaded(data),
    loader: () =>
      apiClient
        .get<ZetkinMembership[]>('/api/users/me/memberships')
        .catch(() => []),
  });
}
