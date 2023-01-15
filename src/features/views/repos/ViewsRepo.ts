import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { ViewTreeData } from 'pages/api/views/tree';
import {
  allItemsLoad,
  allItemsLoaded,
  folderUpdate,
  folderUpdated,
  viewCreate,
  viewCreated,
  viewUpdate,
  viewUpdated,
} from '../store';
import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

export default class ViewsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  async createView(orgId: number, folderId = 0): Promise<ZetkinView> {
    this._store.dispatch(viewCreate());
    const view = await this._apiClient.post<ZetkinView>(
      `/api/views/createNew?orgId=${orgId}&folderId=${folderId}`,
      {}
    );
    this._store.dispatch(viewCreated(view));
    return view;
  }

  getViewTree(orgId: number): IFuture<ViewTreeData> {
    const state = this._store.getState();
    if (
      shouldLoad(state.views.folderList) ||
      shouldLoad(state.views.viewList)
    ) {
      this._store.dispatch(allItemsLoad());
      const promise = this._apiClient
        .get<ViewTreeData>(`/api/views/tree?orgId=${orgId}`)
        .then((items) => {
          this._store.dispatch(allItemsLoaded(items));
          return items;
        });
      return new PromiseFuture(promise);
    } else {
      return new ResolvedFuture({
        folders: state.views.folderList.items.map((item) => item.data!),
        views: state.views.viewList.items.map((item) => item.data!),
      });
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

  updateView(
    orgId: number,
    viewId: number,
    data: Partial<Omit<ZetkinView, 'id'>>
  ): IFuture<ZetkinView> {
    const mutating = Object.keys(data);
    this._store.dispatch(viewUpdate([viewId, mutating]));
    const promise = this._apiClient
      .patch<ZetkinView>(`/api/orgs/${orgId}/people/views/${viewId}`, data)
      .then((view) => {
        this._store.dispatch(viewUpdated([view, mutating]));
        return view;
      });

    return new PromiseFuture(promise);
  }
}
