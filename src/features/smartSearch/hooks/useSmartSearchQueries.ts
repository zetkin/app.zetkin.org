import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinQuery } from '../components/types';
import { queriesLoad, queriesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useSmartSearchQueries(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector((state) => state.smartSearch.queryList);

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => queriesLoad(),
    actionOnSuccess: (queries) => queriesLoaded(queries),
    loader: () =>
      apiClient.get<ZetkinQuery[]>(`/api/orgs/${orgId}/people/queries`),
  });
}
