import IApiClient from 'core/api/client/IApiClient';
import { Store } from '../store';

type EnvVars = {
  MUIX_LICENSE_KEY: string | null;
  ZETKIN_APP_DOMAIN: string | null;
};

export default class Environment {
  private _apiClient: IApiClient;
  private _store: Store;
  private _vars: EnvVars;

  get apiClient() {
    return this._apiClient;
  }

  constructor(store: Store, apiClient: IApiClient, envVars?: EnvVars) {
    this._apiClient = apiClient;
    this._store = store;
    this._vars = envVars || {
      MUIX_LICENSE_KEY: null,
      ZETKIN_APP_DOMAIN: null,
    };
  }

  get store() {
    return this._store;
  }

  get vars() {
    return this._vars;
  }
}
