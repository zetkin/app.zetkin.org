import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import TagsRepo from 'features/tags/repos/TagsRepo';
import ViewDataRepo from '../repos/ViewDataRepo';
import { ZetkinQuery } from 'utils/types/zetkin';
import { ZetkinViewColumn } from '../components/types';

export default class ViewDataModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewDataRepo;
  private _tagsRepo: TagsRepo;
  private _viewId: number;

  constructor(env: Environment, orgId: number, viewId: number) {
    super();

    this._repo = new ViewDataRepo(env);
    this._tagsRepo = new TagsRepo(env);
    this._orgId = orgId;
    this._viewId = viewId;
  }

  updateColumn(columnId: number, data: Partial<Omit<ZetkinViewColumn, 'id'>>) {
    return this._repo.updateColumn(this._orgId, this._viewId, columnId, data);
  }

  updateColumnOrder(columnOrder: number[]): Promise<void> {
    return this._repo.updateColumnOrder(this._orgId, this._viewId, columnOrder);
  }

  updateContentQuery(query: Pick<ZetkinQuery, 'filter_spec'>) {
    return this._repo.updateViewContentQuery(this._orgId, this._viewId, query);
  }
}
