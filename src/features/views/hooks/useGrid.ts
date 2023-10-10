import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { ZetkinViewColumn } from '../components/types';
import { columnsLoad, columnsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

interface UseGridReturn {
  columnsFuture: IFuture<ZetkinViewColumn[]>;
}
export default function useGrid(orgId: number, viewId: number): UseGridReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const views = useAppSelector((state) => state.views);

  const columnsFuture = loadListIfNecessary(
    views.columnsByViewId[viewId],
    dispatch,
    {
      actionOnLoad: () => columnsLoad(viewId),
      actionOnSuccess: (columns) => columnsLoaded([viewId, columns]),
      loader: () =>
        apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}/columns`),
    }
  );
  return { columnsFuture };
}
