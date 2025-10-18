import { useMemo } from 'react';

import { FutureBase, IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userMembershipsLoad, userMembershipsLoaded } from '../store';

export default function useMemberships(
  ignoreRole?: boolean
): IFuture<ZetkinMembership[]> {
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

  return useMemo(() => {
    if (
      ignoreRole ||
      !membershipsFuture.data ||
      membershipsFuture.data.length === 0
    ) {
      return membershipsFuture;
    }

    const filtered = membershipsFuture.data.filter(
      (m: ZetkinMembership) => m.role != null
    );
    return new FutureBase(
      filtered,
      membershipsFuture.error,
      membershipsFuture.isLoading
    );
  }, [membershipsFuture]);
}
