import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinView } from '../components/types';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { viewLoad, viewLoaded } from '../store';

export default function useView(
  orgId: number,
  viewId: number
): IFuture<ZetkinView> {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const views = useAppSelector((state) => state.views);
  const item = views.viewList.items.find((item) => item.id == viewId);

  return loadItemIfNecessary(item, dispatch, {
    actionOnLoad: () => viewLoad(viewId),
    actionOnSuccess: (view) => viewLoaded(view),
    loader: () => apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`),
  });
}
