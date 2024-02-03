import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { membershipsLoad, membershipsLoaded } from 'features/user/store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useMemberships(): IFuture<ZetkinMembership[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const membershipList = useAppSelector((state) => state.user.membershipList);

  return loadListIfNecessary(membershipList, dispatch, {
    actionOnLoad: () => dispatch(membershipsLoad()),
    actionOnSuccess: (data) => dispatch(membershipsLoaded(data)),
    loader: () =>
      apiClient.get<ZetkinMembership[]>(`/api/users/me/memberships`),
  });
}
