import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';

import { Store } from 'core/store';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagUnassigned } from '../store';

export default class TagsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  async assignTagToPerson(
    orgId: number,
    personId: number,
    tagId: number,
    value?: string
  ) {
    const data = value ? { value } : undefined;
    const tag = await this._apiClient.put<ZetkinTag>(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`,
      data
    );
    this._store.dispatch(tagAssigned([personId, tag]));
  }

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  async removeTagFromPerson(orgId: number, personId: number, tagId: number) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`
    );
    this._store.dispatch(tagUnassigned([personId, tagId]));
  }
}
