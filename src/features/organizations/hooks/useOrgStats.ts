import { useApiClient, useAppSelector } from 'core/hooks';
import { organizationStatsLoad, organizationStatsLoaded } from '../store';
import getOrgStats from '../rpc/getOrgStats';
import useRemoteItem from 'core/hooks/useRemoteItem';

export default function useOrgStats(orgId: number) {
  const apiClient = useApiClient();
  const orgStats = useAppSelector((state) => state.organizations.orgStats);

  return useRemoteItem(orgStats, {
    actionOnLoad: () => organizationStatsLoad(),
    actionOnSuccess: (data) => organizationStatsLoaded([orgId, data]),
    loader: () => {
      return apiClient.rpc(getOrgStats, { orgId });
    },
  });
}
