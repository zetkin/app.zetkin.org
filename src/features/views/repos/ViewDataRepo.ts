import { PayloadAction } from '@reduxjs/toolkit';

import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  columnsLoad,
  columnsLoaded,
  rowsLoad,
  rowsLoaded,
  viewLoad,
  viewLoaded,
} from '../store';
import {
  IFuture,
  PromiseFuture,
  RemoteItemFuture,
  RemoteListFuture,
} from 'core/caching/futures';
import { RemoteItem, RemoteList } from 'utils/storeUtils';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../components/types';

export default class ViewDataRepo {
  private _apiClient: IApiClient;
  private _store: Store;

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
}

// TODO: This is a candidate for reuse
function loadListIfNecessary<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType[]
>(
  remoteList: RemoteList<DataType> | undefined,
  store: Store,
  hooks: {
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (items: DataType[]) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType[]>;
  }
): IFuture<DataType[]> {
  if (!remoteList || shouldLoad(remoteList)) {
    store.dispatch(hooks.actionOnLoad());
    const promise = hooks.loader().then((val) => {
      store.dispatch(hooks.actionOnSuccess(val));
      return val;
    });

    return new PromiseFuture(promise);
  }

  return new RemoteListFuture(remoteList);
}

function loadItemIfNecessary<
  DataType,
  OnLoadPayload = void,
  OnSuccessPayload = DataType
>(
  remoteItem: RemoteItem<DataType> | undefined,
  store: Store,
  hooks: {
    actionOnLoad: () => PayloadAction<OnLoadPayload>;
    actionOnSuccess: (item: DataType) => PayloadAction<OnSuccessPayload>;
    loader: () => Promise<DataType>;
  }
): IFuture<DataType> {
  if (!remoteItem || shouldLoad(remoteItem)) {
    store.dispatch(hooks.actionOnLoad());
    const promise = hooks.loader().then((val) => {
      store.dispatch(hooks.actionOnSuccess(val));
      return val;
    });

    return new PromiseFuture(promise);
  }

  return new RemoteItemFuture(remoteItem);
}
