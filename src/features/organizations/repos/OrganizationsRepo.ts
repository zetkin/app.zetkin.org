import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { Store } from 'core/store';
import { organizationsLoad, organizationsLoaded } from '../store';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

export default class OrganizationsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  getOrganizations(): IFuture<ZetkinOrganization[]> {
    const state = this._store.getState();
    return loadListIfNecessary(state.organizations.allOrgs, this._store, {
      actionOnLoad: () => organizationsLoad(),
      actionOnSuccess: (data) => organizationsLoaded(data),
      loader: () =>
        this._apiClient
          .get<ZetkinMembership[]>(`/api/users/me/memberships`)
          .then((response) => response.filter((m) => m.role != null))
          .then((filteredResponse) =>
            filteredResponse.map((m) => m.organization)
          ),
    });
  }
}
