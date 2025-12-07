import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import getSuborgWithStats from '../rpc/getSuborgWithStats';
import { suborgWithStatsLoad, suborgWithStatsLoaded } from '../store';

export default function useSuborgWithFullStats(suborgId: number) {
  const apiClient = useApiClient();
  const item = useAppSelector(
    (state) => state.organizations.statsBySuborgId[suborgId]
  );

  return useRemoteItem(item, {
    actionOnLoad: () => suborgWithStatsLoad(suborgId),
    actionOnSuccess: (data) => suborgWithStatsLoaded([suborgId, data]),
    cacheKey: `suborg-with-full-stats-${suborgId}`,
    loader: () => apiClient.rpc(getSuborgWithStats, { orgId: suborgId }),
  });
}
