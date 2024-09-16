import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { potentialDuplicatesLoad, potentialDuplicatesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useDuplicates(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const duplicatesList = useAppSelector(
    (state) => state.duplicates.potentialDuplicatesList
  );

  return loadListIfNecessary(duplicatesList, dispatch, {
    actionOnLoad: () => potentialDuplicatesLoad(),
    actionOnSuccess: (duplicates) => potentialDuplicatesLoaded(duplicates),
    loader: () => apiClient.get(`/api/orgs/${orgId}/people/duplicates?filter=status==pending`),
  });
}
