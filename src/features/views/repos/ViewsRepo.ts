import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { ViewTreeItem } from 'pages/api/views/tree';
import { IFuture, PromiseFuture, RemoteListFuture } from 'core/caching/futures';
import { treeLoad, treeLoadded } from '../store';

export default class ViewsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getViewTree(orgId: number): IFuture<ViewTreeItem[]> {
    const state = this._store.getState();
    if (shouldLoad(state.views.treeList)) {
      this._store.dispatch(treeLoad());
      const promise = this._apiClient
        .get<ViewTreeItem[]>(`/api/views/tree?orgId=${orgId}`)
        .then((items) => {
          this._store.dispatch(treeLoadded(items));
          return items;
        });
      return new PromiseFuture(promise);
    } else {
      return new RemoteListFuture(state.views.treeList);
    }
  }
}
