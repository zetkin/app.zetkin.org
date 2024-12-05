import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userMembershipsLoad, userMembershipsLoaded } from '../store';

export default function useMembership(
  orgId: number
): IFuture<ZetkinMembership | null> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const membershipList = useAppSelector(
    (state) => state.organizations.userMembershipList
  );

  const membershipsFuture = loadListIfNecessary(membershipList, dispatch, {
    actionOnLoad: () => dispatch(userMembershipsLoad()),
    actionOnSuccess: (data) => dispatch(userMembershipsLoaded(data)),
    loader: () =>
      apiClient.get<ZetkinMembership[]>(`/api/users/me/memberships`),
  });

  if (membershipsFuture.data) {
    return new ResolvedFuture(
      membershipsFuture.data.find(
        (membership) => membership.organization.id == orgId
      ) || null
    );
  }

  return new LoadingFuture();
}
