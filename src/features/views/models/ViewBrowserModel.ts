import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';
import { ViewTreeItem } from 'pages/api/views/tree';
import { ZetkinViewFolder } from '../components/types';
import { FutureBase, IFuture, ResolvedFuture } from 'core/caching/futures';

export default class ViewBrowserModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewsRepo;

  constructor(env: Environment, orgId: number) {
    super();
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

  getItems(folderId: number | null = null): IFuture<ViewTreeItem[]> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return itemsFuture;
    }

    return new ResolvedFuture(
      itemsFuture.data.filter((item) => item.folderId == folderId)
    );
  }
}
