import getMembershipsList from '../rpc/getOfficialMemberships';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinMembership } from 'utils/types/zetkin';
import { officialMembershipsLoad, officialMembershipsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useOfficialMemberships(
  orgId: number
): IFuture<ZetkinMembership[]> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const officialMembershipsList = useAppSelector(
    (state) => state.settings.officialMembershipsList
  );

  return loadListIfNecessary(officialMembershipsList, dispatch, {
    actionOnLoad: () => officialMembershipsLoad(),
    actionOnSuccess: (data) => officialMembershipsLoaded(data),
    loader: () => apiClient.rpc(getMembershipsList, { orgId }),
  });
}
