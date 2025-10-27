import { useApiClient, useAppSelector } from 'core/hooks';
import { suborgsWithStatsLoad, suborgsWithStatsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import getSuborgsWithStats from '../rpc/getSuborgsWithStats';

export default function useSuborgsWithStats(orgId: number) {
  const apiClient = useApiClient();
  const suborgsWithStats = useAppSelector(
    (state) => state.organizations.suborgsWithStats
  );

  return useRemoteList(suborgsWithStats, {
    actionOnLoad: () => suborgsWithStatsLoad(),
    actionOnSuccess: (data) => suborgsWithStatsLoaded(data),
    loader: () => {
      try {
        return apiClient.rpc(getSuborgsWithStats, { orgId });
      } catch (e) {
        return Promise.resolve([
          {
            error: true,
            id: 'loadingError',
            message: 'There was an error loading the sub organization data',
          },
        ]);
      }
    },
  });
}
