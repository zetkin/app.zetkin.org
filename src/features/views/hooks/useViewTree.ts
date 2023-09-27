import { useSelector, useStore } from 'react-redux';

import { RootState } from 'core/store';
import shouldLoad from 'core/caching/shouldLoad';
import { useApiClient } from 'core/hooks';
import { ViewTreeData } from 'pages/api/views/tree';
import { allItemsLoad, allItemsLoaded } from '../store';
import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';

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
