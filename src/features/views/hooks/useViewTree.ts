import shouldLoad from 'core/caching/shouldLoad';
import { ViewTreeData } from 'pages/api/views/tree';
import { allItemsLoad, allItemsLoaded } from '../store';
import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

export default function useViewTree(orgId: number): IFuture<ViewTreeData> {
  const apiClient = useApiClient();
  const views = useAppSelector((state) => state.views);
  const dispatch = useAppDispatch();

  if (shouldLoad(views.folderList) || shouldLoad(views.viewList)) {
    dispatch(allItemsLoad());
    const promise = apiClient
      .get<ViewTreeData>(`/api/views/tree?orgId=${orgId}`)
      .then((items) => {
        dispatch(allItemsLoaded(items));
        return items;
      });
    return new PromiseFuture(promise);
  } else {
    return new ResolvedFuture({
      folders: views.folderList.items.map((item) => item.data!),
      views: views.viewList.items.map((item) => item.data!),
    });
  }
}
