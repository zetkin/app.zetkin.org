import IApiClient from 'core/api/client/IApiClient';
import { Store } from '../store';

export default class Environment {
  private _apiClient: IApiClient;
  private _store: Store;

  get apiClient() {
    return this._apiClient;
  }

  constructor(store: Store, apiClient: IApiClient) {
    this._apiClient = apiClient;
    this._store = store;
  }

  get store() {
    return this._store;
  }
}
