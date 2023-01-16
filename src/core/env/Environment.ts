import IApiClient from 'core/api/client/IApiClient';
import { NextRouter } from 'next/router';
import { Store } from '../store';

export default class Environment {
  private _apiClient: IApiClient;
  private _router: NextRouter;
  private _store: Store;

  get apiClient() {
    return this._apiClient;
  }

  constructor(store: Store, apiClient: IApiClient, router: NextRouter) {
    this._apiClient = apiClient;
    this._router = router;
    this._store = store;
  }

  get router() {
    return this._router;
  }

  get store() {
    return this._store;
  }
}
