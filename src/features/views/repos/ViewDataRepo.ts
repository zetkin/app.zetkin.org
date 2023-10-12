import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { Store } from 'core/store';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  cellUpdate,
  cellUpdated,
  columnAdded,
  columnDeleted,
  columnsLoad,
  columnsLoaded,
  columnUpdated,
  rowAdded,
  rowRemoved,
  rowsLoad,
  rowsLoaded,
  viewLoad,
  viewLoaded,
  viewQueryUpdated,
  viewUpdate,
  viewUpdated,
} from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../components/types';

type ZetkinViewUpdateBody = Partial<Omit<ZetkinView, 'id' | 'folder'>> & {
  folder_id?: number | null;
};

export default class ViewDataRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  async addColumnToView(
    orgId: number,
    viewId: number,
    data: Omit<ZetkinViewColumn, 'id'>
  ): Promise<void> {
    const column = await this._apiClient.post<
      ZetkinViewColumn,
      Omit<ZetkinViewColumn, 'id'>
    >(`/api/orgs/${orgId}/people/views/${viewId}/columns`, data);

    this._store.dispatch(columnAdded([viewId, column]));
  }

  async addPersonToView(
    orgId: number,
    viewId: number,
    personId: number
  ): Promise<void> {
    const row = await this._apiClient.put<ZetkinViewRow>(
      `/api/orgs/${orgId}/people/views/${viewId}/rows/${personId}`
    );
    this._store.dispatch(rowAdded([viewId, row]));
  }

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

  async deleteColumn(orgId: number, viewId: number, columnId: number) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/people/views/${viewId}/columns/${columnId}`
    );
    this._store.dispatch(columnDeleted([viewId, columnId]));
  }

  async deleteViewContentQuery(orgId: number, viewId: number) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/people/views/${viewId}/content_query`
    );
    this._store.dispatch(viewQueryUpdated([viewId, null]));
  }

  getColumns(orgId: number, viewId: number): IFuture<ZetkinViewColumn[]> {
    const state = this._store.getState();
    const list = state.views.columnsByViewId[viewId];

    return loadListIfNecessary(list, this._store.dispatch, {
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

    return loadListIfNecessary(list, this._store.dispatch, {
      actionOnLoad: () => rowsLoad(viewId),
      actionOnSuccess: (rows) => rowsLoaded([viewId, rows]),
      loader: () =>
        this._apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}/rows`),
    });
  }

  getView(orgId: number, viewId: number): IFuture<ZetkinView> {
    const state = this._store.getState();
    const item = state.views.viewList.items.find((item) => item.id == viewId);
    return loadItemIfNecessary(item, this._store.dispatch, {
      actionOnLoad: () => viewLoad(viewId),
      actionOnSuccess: (view) => viewLoaded(view),
      loader: () =>
        this._apiClient.get(`/api/orgs/${orgId}/people/views/${viewId}`),
    });
  }

  async removeRows(
    orgId: number,
    viewId: number,
    rows: number[]
  ): Promise<void> {
    await this._apiClient.post(
      `/api/views/removeRows?orgId=${orgId}&viewId=${viewId}`,
      { rows }
    );

    rows.forEach((rowId) => this._store.dispatch(rowRemoved([viewId, rowId])));
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

  async updateColumn(
    orgId: number,
    viewId: number,
    columnId: number,
    data: Partial<Omit<ZetkinViewColumn, 'id'>>
  ) {
    const column = await this._apiClient.patch<
      ZetkinViewColumn,
      Partial<Omit<ZetkinViewColumn, 'id'>>
    >(`/api/orgs/${orgId}/people/views/${viewId}/columns/${columnId}`, data);
    this._store.dispatch(columnUpdated([viewId, column]));
  }

  updateView(
    orgId: number,
    viewId: number,
    data: ZetkinViewUpdateBody
  ): IFuture<ZetkinView> {
    const mutating = Object.keys(data);
    this._store.dispatch(viewUpdate([viewId, mutating]));
    const promise = this._apiClient
      .patch<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`, data)
      .then((view) => {
        this._store.dispatch(viewUpdated([view, mutating]));
        return view;
      });

    return new PromiseFuture(promise);
  }

  async updateViewContentQuery(
    orgId: number,
    viewId: number,
    data: Pick<ZetkinQuery, 'filter_spec'>
  ) {
    const query = await this._apiClient.patch<ZetkinQuery>(
      `/api/orgs/${orgId}/people/views/${viewId}/content_query`,
      data
    );
    this._store.dispatch(viewQueryUpdated([viewId, query]));
  }
}
