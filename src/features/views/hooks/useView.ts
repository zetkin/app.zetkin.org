import { serializeError } from 'utils/storeUtils/serializeError';
import { ErrorFuture, IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { viewError, viewLoad, viewLoaded } from '../store';

export default function useView(
  orgId: number,
  viewId: number
): IFuture<ZetkinView> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const views = useAppSelector((state) => state.views);
  const item = views.viewsByOrgId[orgId]?.items.find(
    (item) => item.id == viewId
  );

  if (item?.error) {
    return new ErrorFuture(item.error);
  }

  return loadItemIfNecessary(item, dispatch, {
    actionOnError: (err) => viewError([orgId, viewId, serializeError(err)]),
    actionOnLoad: () => viewLoad([orgId, viewId]),
    actionOnSuccess: (view) => viewLoaded([orgId, view]),
    loader: () => apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`),
  });
}
