import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';
import { ViewTreeItem } from 'pages/api/views/tree';
import { ZetkinViewFolder } from '../components/types';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

type ViewBrowserBackItem = {
  folderId: number | null;
  id: string;
  title: string | null;
  type: 'back';
};

export type ViewBrowserItem = ViewTreeItem | ViewBrowserBackItem;

export default class ViewBrowserModel extends ModelBase {
  private _env: Environment;
  private _orgId: number;
  private _repo: ViewsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._env = env;
    this._orgId = orgId;
    this._repo = new ViewsRepo(env);
  }

  getFolder(folderId: number): IFuture<ZetkinViewFolder> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    const item = itemsFuture.data.find(
      (item) => item.type == 'folder' && item.data.id == folderId
    );
    return new ResolvedFuture(item?.type == 'folder' ? item.data : null);
  }

  getItemSummary(
    folderId: number | null = null
  ): IFuture<{ folders: number; views: number }> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return new FutureBase(null, itemsFuture.error, itemsFuture.isLoading);
    }

    return new ResolvedFuture({
      folders: itemsFuture.data.filter(
        (item) => item.type == 'folder' && item.folderId == folderId
      ).length,
      views: itemsFuture.data.filter(
        (item) => item.type == 'view' && item.folderId == folderId
      ).length,
    });
  }

  getItems(folderId: number | null = null): IFuture<ViewBrowserItem[]> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return itemsFuture;
    }

    const items: ViewBrowserItem[] = [];

    if (folderId) {
      const folderItem = itemsFuture.data.find(
        (item) => item.type == 'folder' && item.data.id == folderId
      );
      if (folderItem) {
        items.push({
          folderId: folderItem.folderId,
          id: 'back',
          title: (folderItem.data as ZetkinViewFolder).parent?.title ?? null,
          type: 'back',
        });
      }
    }

    return new ResolvedFuture(
      items.concat(itemsFuture.data.filter((item) => item.folderId == folderId))
    );
  }

  itemIsRenaming(type: 'folder' | 'view', id: number): boolean {
    const state = this._env.store.getState();
    const item = state.views.treeList.items.find(
      (item) => item.data?.type == type && item.data?.data.id == id
    );
    return item?.mutating.includes('title') ?? false;
  }

  renameItem(type: 'folder' | 'view', id: number, title: string) {
    if (type == 'folder') {
      this._repo.updateFolder(this._orgId, id, { title });
    } else if (type == 'view') {
      this._repo.updateView(this._orgId, id, { title });
    }
  }
}
