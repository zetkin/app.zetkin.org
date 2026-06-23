import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteList from 'core/hooks/useRemoteList';
import useRemoteListFuture from 'core/hooks/useRemoteListFuture';
import { IFuture } from 'core/caching/futures';
import {
  userMembershipsLoad,
  userMembershipsLoaded,
} from 'features/organizations/store';
import { ZetkinMembership } from 'utils/types/zetkin';

function useListWithHooks() {
  const apiClient = useApiClient();
  const list = useAppSelector(
    (state) => state.organizations.userMembershipList
  );

  return {
    hooks: {
      actionOnLoad: () => userMembershipsLoad(),
      actionOnSuccess: (data: ZetkinMembership[]) =>
        userMembershipsLoaded(data),
      loader: () =>
        apiClient
          .get<ZetkinMembership[]>('/api/users/me/memberships')
          .catch(() => []),
    },
    list,
  };
}

export default function useUserMemberships() {
  const { hooks, list } = useListWithHooks();
  return useRemoteList(list, hooks);
}

export function useUserMembershipsFuture(): IFuture<ZetkinMembership[]> {
  const { hooks, list } = useListWithHooks();
  return useRemoteListFuture(list, hooks);
}
