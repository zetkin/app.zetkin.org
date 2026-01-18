import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import loadPersonFieldsDef from '../rpc/loadPersonFields';
import { detailedPersonsLoad, detailedPersonsLoaded } from '../store';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';

export default function useDetailedPersons(orgId: number, personIds: number[]) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const key = personIds.sort().join(',');
  const list = useAppSelector(
    (state) => state.duplicates.detailedPersonsList[key]
  );

  return loadListIfNecessary(list, dispatch, {
    actionOnLoad: () => detailedPersonsLoad(personIds),
    actionOnSuccess: (data) => detailedPersonsLoaded([personIds, data]),
    isNecessary: () => shouldLoad(list),
    loader: () =>
      apiClient.rpc(loadPersonFieldsDef, {
        orgId,
        personIds,
      }),
  });
}
