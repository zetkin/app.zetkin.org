import {
  ErrorFuture,
  IFuture,
  LoadingFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { userMembershipsLoad, userMembershipsLoaded } from '../store';

export default function useOfficialMemberships(): IFuture<ZetkinMembership[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const membershipList = useAppSelector(
    (state) => state.organizations.userMembershipList
  );

  const future = loadListIfNecessary(membershipList, dispatch, {
    actionOnLoad: () => dispatch(userMembershipsLoad()),
    actionOnSuccess: (data) => dispatch(userMembershipsLoaded(data)),
    loader: () =>
      apiClient.get<ZetkinMembership[]>(`/api/users/me/memberships`),
  });

  if (future.error) {
    return new ErrorFuture(future.error);
  }

  if (future.isLoading) {
    return new LoadingFuture();
  }

  return new ResolvedFuture((future.data || []).filter((m) => m.role != null));
}
