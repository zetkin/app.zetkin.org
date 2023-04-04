import createNew from '../rpc/createNew/client';
import deleteFolder from '../rpc/deleteFolder';
import Environment from 'core/env/Environment';
import getOrganizerActionView from '../rpc/getOrganizerActionView/client';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { ViewTreeData } from 'pages/api/views/tree';
import { ZetkinObjectAccess } from 'core/api/types';
import { ZetkinOfficial } from 'utils/types/zetkin';
import {
  accessAdded,
  accessLoad,
  accessLoaded,
  accessRevoked,
  allItemsLoad,
  allItemsLoaded,
  folderCreate,
  folderCreated,
  folderDeleted,
  folderUpdate,
  folderUpdated,
  officialsLoad,
  officialsLoaded,
  viewCreate,
  viewCreated,
  viewDeleted,
} from '../store';
import {
  IFuture,
  PromiseFuture,
  RemoteListFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

type ZetkinViewFolderPostBody = {
  parent_id?: number;
  title: string;
};

type ZetkinViewFolderUpdateBody = Partial<
  Omit<ZetkinViewFolder, 'id' | 'parent'>
> & {
  parent_id?: number | null;
};

export default class ViewsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  async createFolder(
    orgId: number,
    title: string,
    folderId?: number
  ): Promise<ZetkinViewFolder> {
    this._store.dispatch(folderCreate());
    const folder = await this._apiClient.post<
      ZetkinViewFolder,
      ZetkinViewFolderPostBody
    >(`/api/orgs/${orgId}/people/view_folders`, {
      parent_id: folderId,
      title,
    });

    this._store.dispatch(folderCreated(folder));
    return folder;
  }

  async createView(
    orgId: number,
    folderId = 0,
    rows: number[] = []
  ): Promise<ZetkinView> {
    this._store.dispatch(viewCreate());
    const view = await this._apiClient.rpc(createNew, {
      folderId,
      orgId,
      rows,
    });
    this._store.dispatch(viewCreated(view));
    return view;
  }

  async deleteFolder(orgId: number, folderId: number): Promise<void> {
    const report = await this._apiClient.rpc(deleteFolder, { folderId, orgId });
    this._store.dispatch(folderDeleted(report));
  }

  async deleteView(orgId: number, viewId: number): Promise<void> {
    await this._apiClient.delete(`/api/orgs/${orgId}/people/views/${viewId}`);
    this._store.dispatch(viewDeleted(viewId));
  }

  // TODO: Move to it's own repo
  getOfficials(orgId: number): IFuture<ZetkinOfficial[]> {
    const state = this._store.getState();
    if (shouldLoad(state.views.officialList)) {
      this._store.dispatch(officialsLoad());
      const promise = this._apiClient
        .get<ZetkinOfficial[]>(`/api/orgs/${orgId}/officials`)
        .then((officials) => {
          this._store.dispatch(officialsLoaded(officials));
          return officials;
        });

      return new PromiseFuture(promise);
    }

    return new RemoteListFuture(state.views.officialList);
  }

  async getOrganizerActionView(orgId: number): Promise<ZetkinView> {
    this._store.dispatch(viewCreate());
    const view = await this._apiClient.rpc(getOrganizerActionView, {
      orgId,
    });
    this._store.dispatch(viewCreated(view));
    return view;
  }

  getViewAccessList(
    orgId: number,
    viewId: number
  ): IFuture<ZetkinObjectAccess[]> {
    const state = this._store.getState();
    const cachedAccessList = state.views.accessByViewId[viewId];
    if (!cachedAccessList || shouldLoad(cachedAccessList)) {
      this._store.dispatch(accessLoad(viewId));
      const promise = this._apiClient
        .get<ZetkinObjectAccess[]>(
          `/api/orgs/${orgId}/people/views/${viewId}/access`
        )
        .then((accessList) => {
          this._store.dispatch(accessLoaded([viewId, accessList]));
          return accessList;
        });

      return new PromiseFuture(promise);
    }

    return new RemoteListFuture(state.views.accessByViewId[viewId]);
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

  grantAccess(
    orgId: number,
    viewId: number,
    personId: number,
    level: ZetkinObjectAccess['level']
  ) {
    this._apiClient
      .put<ZetkinObjectAccess>(
        `/api/orgs/${orgId}/people/views/${viewId}/access/${personId}`,
        {
          level,
        }
      )
      .then((accessObj) => {
        this._store.dispatch(accessAdded([viewId, accessObj]));
      });
  }

  revokeAccess(orgId: number, viewId: number, personId: number) {
    this._apiClient
      .delete(`/api/orgs/${orgId}/people/views/${viewId}/access/${personId}`)
      .then(() => {
        this._store.dispatch(accessRevoked([viewId, personId]));
      });
  }

  updateFolder(
    orgId: number,
    folderId: number,
    data: ZetkinViewFolderUpdateBody
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
