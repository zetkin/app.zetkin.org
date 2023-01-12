import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { ZetkinView } from '../components/types';
import { allViewsLoad, allViewsLoaded } from '../store';
import { IFuture, PromiseFuture, RemoteListFuture } from 'core/caching/futures';

export default class ViewsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getAllViews(orgId: number): IFuture<ZetkinView[]> {
    const state = this._store.getState();

    if (shouldLoad(state.views.viewList)) {
      this._store.dispatch(allViewsLoad());
      const promise = this._apiClient
        .get<ZetkinView[]>(`/api/orgs/${orgId}/people/views`)
        .then((views) => {
          this._store.dispatch(allViewsLoaded(views));
          return views;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteListFuture(state.views.viewList);
    }
  }
}
