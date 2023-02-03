import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'features/views/repos/ViewDataRepo';
import { Store } from 'core/store';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagAssigned, tagLoad, tagLoaded, tagUnassigned } from '../store';

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

  getTag(orgId: number, tagId: number): IFuture<ZetkinTag> {
    const state = this._store.getState();
    const item = state.tags.tagList.items.find((item) => item.id == tagId);
    return loadItemIfNecessary(item, this._store, {
      actionOnLoad: () => tagLoad(tagId),
      actionOnSuccess: (tag) => tagLoaded(tag),
      loader: () =>
        this._apiClient.get<ZetkinTag>(
          `/api/orgs/${orgId}/people/tags/${tagId}`
        ),
    });
  }

  async removeTagFromPerson(orgId: number, personId: number, tagId: number) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/people/${personId}/tags/${tagId}`
    );
    this._store.dispatch(tagUnassigned([personId, tagId]));
  }
}
