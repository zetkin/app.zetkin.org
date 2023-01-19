import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';
import { ZetkinObjectAccess } from 'core/api/types';

export default class ViewSharingModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewsRepo;
  private _viewId: number;

  constructor(env: Environment, orgId: number, viewId: number) {
    super();

    this._repo = new ViewsRepo(env);
    this._orgId = orgId;
    this._viewId = viewId;
  }

  getAccessList(): IFuture<ZetkinObjectAccess[]> {
    return this._repo.getViewAccessList(this._orgId, this._viewId);
  }

  grantAccess(personId: number, level: ZetkinObjectAccess['level']) {
    this._repo.grantAccess(this._orgId, this._viewId, personId, level);
  }

  get orgId(): number {
    return this._orgId;
  }
}
