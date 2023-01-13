import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';
import { ViewTreeItem } from 'pages/api/views/tree';
import { IFuture, ResolvedFuture } from 'core/caching/futures';

export default class ViewBrowserModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._repo = new ViewsRepo(env);
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
