import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { loadItemIfNecessary } from 'features/views/repos/ViewDataRepo';
import { Store } from 'core/store';
import { ZetkinTag } from 'utils/types/zetkin';
import { tagLoad, tagLoaded } from '../store';

export default class TagsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

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
}
