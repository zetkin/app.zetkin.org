import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import ViewDataRepo from '../repos/ViewDataRepo';
import { ZetkinViewColumn } from '../components/types';

export default class ViewDataModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewDataRepo;
  private _viewId: number;

  constructor(env: Environment, orgId: number, viewId: number) {
    super();

    this._repo = new ViewDataRepo(env);
    this._orgId = orgId;
    this._viewId = viewId;
  }

  getColumns(): IFuture<ZetkinViewColumn[]> {
    return this._repo.getColumns(this._orgId, this._viewId);
  }
}
