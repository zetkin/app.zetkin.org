import Environment from 'core/env/Environment';
import getUserOrganizationsTree from 'features/organizations/rpc/getOrganizations';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { Store } from 'core/store';
import {
  loadItemIfNecessary,
  loadListIfNecessary,
} from 'core/caching/cacheUtils';
import {
  organizationLoad,
  organizationLoaded,
  treeDataLoad,
  treeDataLoaded,
  userOrganizationsLoad,
  userOrganizationsLoaded,
} from '../store';
import { ZetkinMembership, ZetkinOrganization } from 'utils/types/zetkin';

export default class OrganizationsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  getOrganization(orgId: number): IFuture<ZetkinOrganization> {
    const state = this._store.getState();
    return loadItemIfNecessary(state.organizations.orgData, this._store, {
      actionOnLoad: () => organizationLoad(),
      actionOnSuccess: (data) => organizationLoaded(data),
      loader: () =>
        this._apiClient.get<ZetkinOrganization>(`/api/orgs/${orgId}`),
    });
  }

  getOrganizationsTree() {
    const state = this._store.getState();
    return loadListIfNecessary(state.organizations.treeDataList, this._store, {
      actionOnLoad: () => treeDataLoad(),
      actionOnSuccess: (data) => treeDataLoaded(data),
      loader: () => this._apiClient.rpc(getUserOrganizationsTree, {}),
    });
  }

  getUserOrganizations(): IFuture<ZetkinMembership['organization'][]> {
    const state = this._store.getState();
    return loadListIfNecessary(state.organizations.userOrgList, this._store, {
      actionOnLoad: () => userOrganizationsLoad(),
      actionOnSuccess: (data) => userOrganizationsLoaded(data),
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
