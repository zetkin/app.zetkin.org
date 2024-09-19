import IApiClient from 'core/api/client/IApiClient';

type EnvVars = {
  FEAT_AREAS?: string | null;
  MUIX_LICENSE_KEY: string | null;
  ZETKIN_APP_DOMAIN: string | null;
};

export default class Environment {
  private _apiClient: IApiClient;
  private _vars: EnvVars;

  get apiClient() {
    return this._apiClient;
  }

  constructor(apiClient: IApiClient, envVars?: EnvVars) {
    this._apiClient = apiClient;
    this._vars = envVars || {
      FEAT_AREAS: null,
      MUIX_LICENSE_KEY: null,
      ZETKIN_APP_DOMAIN: null,
    };
  }

  get vars() {
    return this._vars;
  }
}
