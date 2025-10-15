import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { suborgsWithStatsLoad, suborgsWithStatsLoaded } from '../store';
import useRemoteList from 'core/hooks/useRemoteList';
import getSuborgsWithStats from '../rpc/getSuborgsWithStats';

export default function useSuborgsWithStats(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const suborgsWithStats = useAppSelector(
    (state) => state.organizations.suborgsWithStats
  );

  return useRemoteList(suborgsWithStats, {
    actionOnLoad: () => dispatch(suborgsWithStatsLoad()),
    actionOnSuccess: (data) => dispatch(suborgsWithStatsLoaded(data)),
    loader: async () => {
      return await apiClient.rpc(getSuborgsWithStats, { orgId });
    },
  });
}
