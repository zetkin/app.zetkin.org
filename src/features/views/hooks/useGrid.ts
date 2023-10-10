import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { columnsLoad, columnsLoaded, rowsLoad, rowsLoaded } from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinViewColumn, ZetkinViewRow } from '../components/types';

interface UseGridReturn {
  columnsFuture: IFuture<ZetkinViewColumn[]>;
  rowsFuture: IFuture<ZetkinViewRow[]>;
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

  const rowsFuture = loadListIfNecessary(views.rowsByViewId[viewId], dispatch, {
    actionOnLoad: () => rowsLoad(viewId),
    actionOnSuccess: (rows) => rowsLoaded([viewId, rows]),
    loader: () =>
      apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}/rows`),
  });
  return { columnsFuture, rowsFuture };
}
