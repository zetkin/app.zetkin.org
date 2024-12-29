import IApiClient from 'core/api/client/IApiClient';

type EnvVars = {
  FEAT_AREAS?: string | null;
  INSTANCE_OWNER_HREF?: string | null;
  INSTANCE_OWNER_NAME?: string | null;
  MUIX_LICENSE_KEY: string | null;
  ZETKIN_APP_DOMAIN: string | null;
  ZETKIN_GEN2_ORGANIZE_URL?: string | null;
  ZETKIN_PRIVACY_POLICY_LINK?: string | null;
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
      ZETKIN_GEN2_ORGANIZE_URL: null,
      ZETKIN_PRIVACY_POLICY_LINK: null,
    };
  }

  get vars() {
    return this._vars;
  }
}
