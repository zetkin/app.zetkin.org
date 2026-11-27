import { loadListIfNecessary } from 'core/caching/cacheUtils';
import getPotentialDuplicates from '../rpc/getPotentialDuplicates';
import { potentialDuplicatesLoad, potentialDuplicatesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function usePotentialDuplicates(orgId: number) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const list = useAppSelector(
    (state) => state.joinForms.potentialDuplicateList
  );

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => potentialDuplicatesLoad(),
    actionOnSuccess: (data) => potentialDuplicatesLoaded(data),
    loader: () =>
      apiClient
        .rpc(getPotentialDuplicates, { orgId })
        .then((result) => result.potentialDuplicates),
  });
}
