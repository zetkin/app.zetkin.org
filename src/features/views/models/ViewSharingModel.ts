import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewsRepo from '../repos/ViewsRepo';

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

  get orgId(): number {
    return this._orgId;
  }

  revokeAccess(personId: number): void {
    this._repo.revokeAccess(this._orgId, this._viewId, personId);
  }

  get viewId(): number {
    return this._viewId;
  }
}
