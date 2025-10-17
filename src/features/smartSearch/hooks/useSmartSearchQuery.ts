import { useApiClient, useAppSelector } from 'core/hooks';
import useRemoteItem from 'core/hooks/useRemoteItem';
import { queryLoad, queryLoaded } from '../store';
import { ZetkinQuery } from '../components/types';

export default function useSmartSearchQuery(orgId: number, queryId: number) {
  const apiClient = useApiClient();
  const item = useAppSelector((state) =>
    state.smartSearch.queryList.items.find((item) => item.id == queryId)
  );

  return useRemoteItem(item, {
    actionOnLoad: () => queryLoad(queryId),
    actionOnSuccess: (data) => queryLoaded(data),
    loader: () =>
      apiClient.get<ZetkinQuery>(
        `/api/orgs/${orgId}/people/queries/${queryId}`
      ),
  });
}
