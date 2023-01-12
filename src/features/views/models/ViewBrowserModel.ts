import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';
import { ZetkinView } from '../components/types';

export default class ViewBrowserModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._repo = new ViewsRepo(env);
  }

  getViews(): IFuture<ZetkinView[]> {
    return this._repo.getAllViews(this._orgId);
  }
}
