import { PayloadAction } from '@reduxjs/toolkit';

import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { RemoteList } from 'utils/storeUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { ZetkinViewColumn } from '../components/types';
import { columnsLoad, columnsLoaded } from '../store';
import { IFuture, PromiseFuture, RemoteListFuture } from 'core/caching/futures';

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
