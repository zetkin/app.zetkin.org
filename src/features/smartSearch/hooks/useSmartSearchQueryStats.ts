import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { queryStatsLoad, queryStatsLoaded } from '../store';
import { ZetkinSmartSearchFilterStats } from '../types';

export default function useSmartSearchQueryStats(
  orgId: number,
  queryId: number
) {
  const apiClient = useApiClient();
  const item = useAppSelector(
    (state) => state.smartSearch.statsByQueryId[queryId]
  );

  return useRemoteItem(item, {
    actionOnLoad: () => queryStatsLoad(queryId),
    actionOnSuccess: (data) => queryStatsLoaded(data),
    loader: () =>
      apiClient
        .get<ZetkinSmartSearchFilterStats[]>(
          `/api/orgs/${orgId}/people/queries/${queryId}/stats`
        )
        .then((stats) => ({ id: queryId, stats })),
  });
}
