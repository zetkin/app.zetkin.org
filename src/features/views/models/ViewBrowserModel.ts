import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';
import { ViewTreeItem } from 'pages/api/views/tree';
import { IFuture, ResolvedFuture } from 'core/caching/futures';

export default class ViewBrowserModel extends ModelBase {
  private _folderId: number | null;
  private _orgId: number;
  private _repo: ViewsRepo;

  constructor(env: Environment, orgId: number, folderId: number | null = null) {
    super();
    this._orgId = orgId;
    this._folderId = folderId;
    this._repo = new ViewsRepo(env);
  }

  getItems(): IFuture<ViewTreeItem[]> {
    const itemsFuture = this._repo.getViewTree(this._orgId);
    if (!itemsFuture.data) {
      return itemsFuture;
    }

    return new ResolvedFuture(
      itemsFuture.data.filter((item) => item.folderId == this._folderId)
    );
  }
}
