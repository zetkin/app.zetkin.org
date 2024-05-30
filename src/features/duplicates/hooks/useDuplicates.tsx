import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { duplicatesLoad, duplicatesLoaded, ZetkinDuplicate } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useDuplicates(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const duplicatesList = useAppSelector(
    (state) => state.duplicates.duplicatesList
  );

  return loadListIfNecessary(duplicatesList, dispatch, {
    actionOnLoad: () => duplicatesLoad(),
    actionOnSuccess: (duplicates) => duplicatesLoaded(duplicates),
    loader: () =>
      apiClient.get<ZetkinDuplicate[]>(`/api/orgs/${orgId}/people/duplicates`),
  });
}
