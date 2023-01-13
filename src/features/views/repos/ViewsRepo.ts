import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { ViewTreeItem } from 'pages/api/views/tree';
import { ZetkinViewFolder } from '../components/types';
import { folderUpdate, folderUpdated, treeLoad, treeLoadded } from '../store';
import { IFuture, PromiseFuture, RemoteListFuture } from 'core/caching/futures';

export default class ViewsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getViewTree(orgId: number): IFuture<ViewTreeItem[]> {
    const state = this._store.getState();
    if (shouldLoad(state.views.treeList)) {
      this._store.dispatch(treeLoad());
      const promise = this._apiClient
        .get<ViewTreeItem[]>(`/api/views/tree?orgId=${orgId}`)
        .then((items) => {
          this._store.dispatch(treeLoadded(items));
          return items;
        });
      return new PromiseFuture(promise);
    } else {
      return new RemoteListFuture(state.views.treeList);
    }
  }

  updateFolder(
    orgId: number,
    folderId: number,
    data: Partial<Omit<ZetkinViewFolder, 'id'>>
  ): IFuture<ZetkinViewFolder> {
    const mutating = Object.keys(data);
    this._store.dispatch(folderUpdate([folderId, mutating]));
    const promise = this._apiClient
      .patch<ZetkinViewFolder>(
        `/api/orgs/${orgId}/people/view_folders/${folderId}`,
        data
      )
      .then((folder) => {
        this._store.dispatch(folderUpdated([folder, mutating]));
        return folder;
      });

    return new PromiseFuture(promise);
  }
}
