import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewDataRepo from '../repos/ViewDataRepo';
import ViewsRepo from '../repos/ViewsRepo';
import {
  FutureBase,
  IFuture,
  PromiseFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { ZetkinView, ZetkinViewFolder } from '../components/types';

export interface ViewBrowserFolderItem {
  id: number | string;
  type: 'folder';
  title: string;
  owner: string;
  data: ZetkinViewFolder;
  folderId: number | null;
}

export interface ViewBrowserViewItem {
  id: number | string;
  type: 'view';
  title: string;
  owner: string;
  data: ZetkinView;
  folderId: number | null;
}

type ViewBrowserBackItem = {
  folderId: number | null;
  id: string;
  title: string | null;
  type: 'back';
};

export type ViewBrowserItem =
  | ViewBrowserFolderItem
  | ViewBrowserViewItem
  | ViewBrowserBackItem;

export default class ViewBrowserModel extends ModelBase {
  private _dataRepo: ViewDataRepo;
  private _env: Environment;
  private _orgId: number;
  private _repo: ViewsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._repo = new ViewsRepo(env);
    this._dataRepo = new ViewDataRepo(env);
  }

  createFolder(title: string, folderId?: number): IFuture<ZetkinViewFolder> {
    const promise = this._repo
      .createFolder(this._orgId, title, folderId)
      .then((folder) => {
        return folder;
      });
    return new PromiseFuture(promise);
  }

  createView(folderId?: number, rows?: number[]): IFuture<ZetkinView> {
    const promise = this._repo
      .createView(this._orgId, folderId, rows)
      .then((view) => {
        this._env.router.push(
          `/organize/${view.organization.id}/people/lists/${view.id}`
        );
        return view;
      });

    return new PromiseFuture(promise);
  }

  deleteFolder(folderId: number): void {
    this._repo.deleteFolder(this._orgId, folderId);
  }

  deleteView(viewId: number): void {
    this._repo.deleteView(this._orgId, viewId);
  }

  getFolder(folderId: number): IFuture<ZetkinViewFolder> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture(
      itemsFuture.data.folders.find((folder) => folder.id == folderId) || null
    );
  }

  getItemSummary(
    folderId: number | null = null
  ): IFuture<{ folders: number; views: number }> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture({
      folders: itemsFuture.data.folders.filter(
        (folder) => folder.parent?.id == folderId
      ).length,
      views: itemsFuture.data.views.filter(
        (view) => view.folder?.id == folderId
      ).length,
    });
  }

  getItems(folderId: number | null = null): IFuture<ViewBrowserItem[]> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    const items: ViewBrowserItem[] = [];

    if (folderId) {
      const folder = itemsFuture.data.folders.find(
        (folder) => folder.id == folderId
      );
      if (folder) {
        items.push({
          folderId: folder.parent?.id ?? null,
          id: 'back',
          title: folder.parent?.title ?? null,
          type: 'back',
        });
      }
    }

    itemsFuture.data.folders
      .filter((folder) => folder.parent?.id == folderId)
      .forEach((folder) => {
        items.push({
          data: folder,
          folderId: folderId,
          id: 'folders/' + folder.id,
          owner: '',
          title: folder.title,
          type: 'folder',
        });
      });

    itemsFuture.data.views
      .filter((view) => view.folder?.id == folderId)
      .forEach((view) => {
        items.push({
          data: view,
          folderId: folderId,
          id: 'lists/' + view.id,
          owner: view.owner.name,
          title: view.title,
          type: 'view',
        });
      });

    return new ResolvedFuture(items);
  }

  getOrganizerActionView(): IFuture<ZetkinView> {
    const promise = this._repo
      .getOrganizerActionView(this._orgId)
      .then((view) => {
        this._env.router.push(
          `/organize/${view.organization.id}/people/lists/${view.id}`
        );
        console.log(view, ' 뭔데?');
        return view;
      });

    return new PromiseFuture(promise);
  }

  itemIsRenaming(type: 'folder' | 'view', id: number): boolean {
    const state = this._env.store.getState();
    if (type == 'folder') {
      const item = state.views.folderList.items.find((item) => item.id == id);
      return item?.mutating.includes('title') ?? false;
    } else if (type == 'view') {
      const item = state.views.viewList.items.find((item) => item.id == id);
      return item?.mutating.includes('title') ?? false;
    } else {
      return false;
    }
  }

  moveItem(type: 'folder' | 'view', id: number, newParentId: number | null) {
    if (type == 'folder') {
      this._repo.updateFolder(this._orgId, id, { parent_id: newParentId });
    } else if (type == 'view') {
      this._dataRepo.updateView(this._orgId, id, { folder_id: newParentId });
    }
  }

  get recentlyCreatedFolder(): ZetkinViewFolder | null {
    const state = this._env.store.getState();
    return state.views.recentlyCreatedFolder;
  }

  renameItem(type: 'folder' | 'view', id: number, title: string) {
    if (type == 'folder') {
      this._repo.updateFolder(this._orgId, id, { title });
    } else if (type == 'view') {
      this._dataRepo.updateView(this._orgId, id, { title });
    }
  }
}
