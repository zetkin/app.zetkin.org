import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import {
  cellUpdate,
  cellUpdated,
  columnsLoad,
  columnsLoaded,
  rowRemoved,
  rowsLoad,
  rowsLoaded,
} from '../store';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';
import { ZetkinViewColumn, ZetkinViewRow } from '../components/types';

export interface UseViewGridReturn {
  columnsFuture: IFuture<ZetkinViewColumn[]>;
  rowsFuture: IFuture<ZetkinViewRow[]>;
  removeRows: (rows: number[]) => Promise<void>;
  setCellValue: <CellType>(
    personId: number,
    colId: number,
    data: CellType
  ) => void;
}
export default function useViewGrid(
  orgId: number,
  viewId: number
): UseViewGridReturn {
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

  const clearCellData = (rowId: number, colId: number) => {
    dispatch(cellUpdate());
    apiClient
      .delete(
        `/api/orgs/${orgId}/people/views/${viewId}/rows/${rowId}/cells/${colId}`
      )
      .then(() => {
        dispatch(cellUpdated([viewId, rowId, colId, null]));
      });
  };

  const rowsFuture = loadListIfNecessary(views.rowsByViewId[viewId], dispatch, {
    actionOnLoad: () => rowsLoad(viewId),
    actionOnSuccess: (rows) => rowsLoaded([viewId, rows]),
    loader: () =>
      apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}/rows`),
  });

  const removeRows = async (rows: number[]): Promise<void> => {
    await apiClient.post(
      `/api/views/removeRows?orgId=${orgId}&viewId=${viewId}`,
      {
        rows,
      }
    );

    rows.forEach((rowId) => dispatch(rowRemoved([viewId, rowId])));
  };

  const setCellData = <DataType>(
    rowId: number,
    colId: number,
    value: DataType
  ) => {
    dispatch(cellUpdate());
    apiClient
      .put<{ value: DataType }>(
        `/api/orgs/${orgId}/people/views/${viewId}/rows/${rowId}/cells/${colId}`,
        { value }
      )
      .then((data) => {
        dispatch(cellUpdated([viewId, rowId, colId, data.value]));
      });
  };

  const setCellValue = <CellType>(
    personId: number,
    colId: number,
    data: CellType
  ) => {
    if (data !== null) {
      setCellData(personId, colId, data);
    } else {
      clearCellData(personId, colId);
    }
  };
  return { columnsFuture, removeRows, rowsFuture, setCellValue };
}
