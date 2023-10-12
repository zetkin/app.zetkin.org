import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinObjectAccess } from 'core/api/types';
import { accessLoad, accessLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseAccessListReturn {
  accessListFuture: IFuture<ZetkinObjectAccess[]>;
}
export default function useAccessList(
  orgId: number,
  viewId: number
): UseAccessListReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const views = useAppSelector((state) => state.views);
  const cachedAccessList = views.accessByViewId[viewId];

  const accessListFuture = loadListIfNecessary(cachedAccessList, dispatch, {
    actionOnLoad: () => accessLoad(viewId),
    actionOnSuccess: (data) => accessLoaded([viewId, data]),
    loader: () =>
      apiClient.get<ZetkinObjectAccess[]>(
        `/api/orgs/${orgId}/people/views/${viewId}/access`
      ),
  });

  return { accessListFuture };
}
