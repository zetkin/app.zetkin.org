import shouldLoad from 'core/caching/shouldLoad';
import { serializeError } from 'utils/storeUtils/serializeError';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import useTagging from 'features/tags/hooks/useTagging';
import {
  cellUpdate,
  cellUpdated,
  columnsError,
  columnsLoad,
  columnsLoaded,
  columnUpdated,
  rowRemoved,
  rowsError,
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
  toggleTag: (
    personId: number,
    tagId: number,
    assigned: boolean,
    value?: string
  ) => void;
  updateColumn: (
    columnId: number,
    data: Partial<Omit<ZetkinViewColumn, 'id'>>
  ) => Promise<void>;
}
export default function useViewGrid(
  orgId: number,
  viewId: number
): UseViewGridReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const { assignToPerson, removeFromPerson } = useTagging(orgId);
  const views = useAppSelector((state) => state.views);

  const columnsFuture = loadListIfNecessary(
    views.columnsByViewId[viewId],
    dispatch,
    {
      actionOnError: (err) => columnsError([viewId, serializeError(err)]),
      actionOnLoad: () => columnsLoad(viewId),
      actionOnSuccess: (columns) => columnsLoaded([viewId, columns]),
      isNecessary: () =>
        !views.columnsByViewId[viewId]?.error &&
        shouldLoad(views.columnsByViewId[viewId]),
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
    actionOnError: (err) => rowsError([viewId, serializeError(err)]),
    actionOnLoad: () => rowsLoad(viewId),
    actionOnSuccess: (rows) => rowsLoaded([viewId, rows]),
    isNecessary: () =>
      !views.rowsByViewId[viewId]?.error &&
      shouldLoad(views.rowsByViewId[viewId]),
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
      .put<{
        value: DataType;
      }>(
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

  const toggleTag = (
    personId: number,
    tagId: number,
    assigned: boolean,
    value?: string
  ) => {
    if (assigned) {
      assignToPerson(personId, tagId, value);
    } else {
      removeFromPerson(personId, tagId);
    }
  };

  const updateColumn = async (
    columnId: number,
    data: Partial<Omit<ZetkinViewColumn, 'id'>>
  ) => {
    const column = await apiClient.patch<
      ZetkinViewColumn,
      Partial<Omit<ZetkinViewColumn, 'id'>>
    >(`/api/orgs/${orgId}/people/views/${viewId}/columns/${columnId}`, data);
    dispatch(columnUpdated([viewId, column]));
  };

  return {
    columnsFuture,
    removeRows,
    rowsFuture,
    setCellValue,
    toggleTag,
    updateColumn,
  };
}
