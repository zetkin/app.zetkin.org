import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userMembershipsLoad, userMembershipsLoaded } from '../store';

export default function useMemberships(): IFuture<ZetkinMembership[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const membershipList = useAppSelector(
    (state) => state.organizations.userMembershipList
  );

  return loadListIfNecessary(membershipList, dispatch, {
    actionOnLoad: () => dispatch(userMembershipsLoad()),
    actionOnSuccess: (data) => dispatch(userMembershipsLoaded(data)),
    loader: () =>
      apiClient
        .get<ZetkinMembership[]>(`/api/users/me/memberships`)
        .then((response) => response.filter((m) => m.role != null)),
  });
}
