import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { IFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinViewColumn } from '../components/types';
import { columnsLoad, columnsLoaded } from '../store';

interface UseColumnsReturn {
  columnsFuture: IFuture<ZetkinViewColumn[]>;
}
export default function useColumns(
  orgId: number,
  viewId: number
): UseColumnsReturn {
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
