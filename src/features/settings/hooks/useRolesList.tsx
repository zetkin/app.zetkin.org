import getMembershipsList from '../rpc/getMembershipsList';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { membershipsRolesLoad, membershipsRolesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useRolesList(
  orgId: number
): IFuture<ZetkinMembership[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const membershipsList = useAppSelector(
    (state) => state.roles.membershipsList
  );

  return loadListIfNecessary(membershipsList, dispatch, {
    actionOnLoad: () => membershipsRolesLoad(),
    actionOnSuccess: (data) => membershipsRolesLoaded(data),
    loader: () => apiClient.rpc(getMembershipsList, { orgId }),
  });
}
