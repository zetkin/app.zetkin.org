import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewDataRepo from '../repos/ViewDataRepo';
import ViewsRepo from '../repos/ViewsRepo';
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
