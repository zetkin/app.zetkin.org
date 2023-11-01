import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinActivity } from 'utils/types/zetkin';
import { typesLoad, typesLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useEventTypes(
  orgId: number
): IFuture<ZetkinActivity[]> {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const typeList = useAppSelector((state) => state.events.typeList);

  return loadListIfNecessary(typeList, dispatch, {
    actionOnLoad: () => typesLoad(orgId),
    actionOnSuccess: (data) => typesLoaded([orgId, data]),
    loader: () =>
      apiClient.get<ZetkinActivity[]>(`/api/orgs/${orgId}/activities`),
  });
}
