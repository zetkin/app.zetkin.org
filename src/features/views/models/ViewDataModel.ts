import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import ViewDataRepo from '../repos/ViewDataRepo';
import { ZetkinQuery } from 'utils/types/zetkin';

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

  updateColumnOrder(columnOrder: number[]): Promise<void> {
    return this._repo.updateColumnOrder(this._orgId, this._viewId, columnOrder);
  }

  updateContentQuery(query: Pick<ZetkinQuery, 'filter_spec'>) {
    return this._repo.updateViewContentQuery(this._orgId, this._viewId, query);
  }
}
