import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import TagsRepo from 'features/tags/repos/TagsRepo';
import ViewDataRepo from '../repos/ViewDataRepo';
import ViewsRepo from '../repos/ViewsRepo';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../components/types';

export default class ViewDataModel extends ModelBase {
  private _orgId: number;
  private _repo: ViewDataRepo;
  private _tagsRepo: TagsRepo;
  private _viewId: number;
  private _viewsRepo: ViewsRepo;

  constructor(env: Environment, orgId: number, viewId: number) {
    super();

    this._repo = new ViewDataRepo(env);
    this._tagsRepo = new TagsRepo(env);
    this._viewsRepo = new ViewsRepo(env);
    this._orgId = orgId;
    this._viewId = viewId;
  }

  delete(): Promise<void> {
    return this._viewsRepo.deleteView(this._orgId, this._viewId);
  }

  deleteColumn(columnId: number) {
    return this._repo.deleteColumn(this._orgId, this._viewId, columnId);
  }

  deleteContentQuery() {
    return this._repo.deleteViewContentQuery(this._orgId, this._viewId);
  }

  getColumns(): IFuture<ZetkinViewColumn[]> {
    return this._repo.getColumns(this._orgId, this._viewId);
  }

  getRows(): IFuture<ZetkinViewRow[]> {
    return this._repo.getRows(this._orgId, this._viewId);
  }

  getView(): IFuture<ZetkinView> {
    return this._repo.getView(this._orgId, this._viewId);
  }

  removeRows(rows: number[]): Promise<void> {
    return this._repo.removeRows(this._orgId, this._viewId, rows);
  }

  setCellValue<CellType>(personId: number, colId: number, data: CellType) {
    if (data !== null) {
      this._repo.setCellData(this._orgId, this._viewId, personId, colId, data);
    } else {
      this._repo.clearCellData(this._orgId, this._viewId, personId, colId);
    }
  }

  setTitle(newTitle: string) {
    this._repo.updateView(this._orgId, this._viewId, { title: newTitle });
  }

  toggleTag(personId: number, tagId: number, assigned: boolean) {
    if (assigned) {
      this._tagsRepo.assignTagToPerson(this._orgId, personId, tagId);
    } else {
      this._tagsRepo.removeTagFromPerson(this._orgId, personId, tagId);
    }
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
