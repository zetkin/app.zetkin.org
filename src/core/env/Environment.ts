import IApiClient from 'core/api/client/IApiClient';

/**
 * Defines the [runtime environment
 * variables](../documents/Environment_Variables.html#md:build-time-vs-runtime-environment-variables)
 * available.
 
 * These are made available to [app router](https://nextjs.org/docs/app) code
 * via `ClientContext` and to [pages router](https://nextjs.org/docs/pages) code
 * via `scaffold()`. In both routers, they're provided as part of an
 * [`Environment`](../classes/Environment.html) instance and accessed via
 * [`useEnv()`](../functions/useEnv).
 * 
 * We use the same type alias for both routers in order to
 * keep the runtime environment variables aligned across this architectural
 * boundary. Keeping them aligned in this way is intended to facilitate gradual
 * adoption of the app router by minimising friction related to environment
 * variables.
 *
 * @category Environment Variables
 */
export type EnvVars = {
  FEAT_AREAS?: string;
  INSTANCE_OWNER_HREF?: string;
  INSTANCE_OWNER_NAME?: string;
  MUIX_LICENSE_KEY?: string;
  ZETKIN_APP_DOMAIN?: string;
  ZETKIN_GEN2_ORGANIZE_URL?: string;
  ZETKIN_PRIVACY_POLICY_LINK?: string;
};

/**
 * Return value of {@link useEnv `useEnv()`}.
 *
 * In app router code, this is added to the global context as part of
 * [`ClientContext`](https://github.com/zetkin/app.zetkin.org/blob/main/src/core/env/ClientContext.tsx)
 * as part of the [root
 * layout](https://github.com/zetkin/app.zetkin.org/blob/main/src/app/layout.tsx).
 * In pages router code, it's added by
 * [`Providers`](https://github.com/zetkin/app.zetkin.org/blob/main/src/core/Providers.tsx)
 * as part of the [custom app](https://github.com/zetkin/app.zetkin.org/blob/main/src/pages/_app.tsx).
 *
 * @category Environment Variables
 */
export default class Environment {
  private _apiClient: IApiClient;
  private _vars: EnvVars;

  get apiClient() {
    return this._apiClient;
  }

  constructor(apiClient: IApiClient, envVars?: EnvVars) {
    this._apiClient = apiClient;
    this._vars = envVars || {};
  }

  get vars() {
    return this._vars;
  }
}
