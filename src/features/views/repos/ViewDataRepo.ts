import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { Store } from 'core/store';
import {
  cellUpdate,
  cellUpdated,
  columnsLoad,
  columnsLoaded,
  rowsLoad,
  rowsLoaded,
  viewLoad,
  viewLoaded,
} from '../store';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../components/types';

export default class ViewDataRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  clearCellData(orgId: number, viewId: number, rowId: number, colId: number) {
    this._store.dispatch(cellUpdate());
    this._apiClient
      .delete(
        `/api/orgs/${orgId}/people/views/${viewId}/rows/${rowId}/cells/${colId}`
      )
      .then(() => {
        this._store.dispatch(cellUpdated([viewId, rowId, colId, null]));
      });
  }

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getColumns(orgId: number, viewId: number): IFuture<ZetkinViewColumn[]> {
    const state = this._store.getState();
    const list = state.views.columnsByViewId[viewId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => columnsLoad(viewId),
      actionOnSuccess: (columns) => columnsLoaded([viewId, columns]),
      loader: () =>
        this._apiClient.get(
          `/api/orgs/${orgId}/people/views/${viewId}/columns`
        ),
    });
  }

  getRows(orgId: number, viewId: number): IFuture<ZetkinViewRow[]> {
    const state = this._store.getState();
    const list = state.views.rowsByViewId[viewId];

    return loadListIfNecessary(list, this._store, {
      actionOnLoad: () => rowsLoad(viewId),
      actionOnSuccess: (rows) => rowsLoaded([viewId, rows]),
      loader: () =>
        this._apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}/rows`),
    });
  }

  getView(orgId: number, viewId: number): IFuture<ZetkinView> {
    const state = this._store.getState();
    const item = state.views.viewList.items.find((item) => item.id == viewId);
    return loadItemIfNecessary(item, this._store, {
      actionOnLoad: () => viewLoad(viewId),
      actionOnSuccess: (view) => viewLoaded(view),
      loader: () =>
        this._apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`),
    });
  }

  setCellData<DataType>(
    orgId: number,
    viewId: number,
    rowId: number,
    colId: number,
    value: DataType
  ) {
    this._store.dispatch(cellUpdate());
    this._apiClient
      .put<{ value: DataType }>(
        `/api/orgs/${orgId}/people/views/${viewId}/rows/${rowId}/cells/${colId}`,
        { value }
      )
      .then((data) => {
        this._store.dispatch(cellUpdated([viewId, rowId, colId, data.value]));
      });
  }
}
