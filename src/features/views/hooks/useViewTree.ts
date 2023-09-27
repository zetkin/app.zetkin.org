import { IFuture, ResolvedFuture, PromiseFuture } from 'core/caching/futures';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import { RootState } from 'core/store';
import { ViewTreeData } from 'pages/api/views/tree';
import { useStore, useSelector } from 'react-redux';
import { allItemsLoad, allItemsLoaded } from '../store';

export default function useViewTree(orgId: number): IFuture<ViewTreeData> {
  const apiClient = useApiClient();
  const store = useStore();
  const views = useSelector((state: RootState) => state.views);

  if (shouldLoad(views.folderList) || shouldLoad(views.viewList)) {
    store.dispatch(allItemsLoad());
    const promise = apiClient
      .get<ViewTreeData>(`/api/views/tree?orgId=${orgId}`)
      .then((items) => {
        store.dispatch(allItemsLoaded(items));
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
