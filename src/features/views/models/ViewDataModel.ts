import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import ViewDataRepo from '../repos/ViewDataRepo';
import {
  ZetkinView,
  ZetkinViewColumn,
  ZetkinViewRow,
} from '../components/types';

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

  getRows(): IFuture<ZetkinViewRow[]> {
    return this._repo.getRows(this._orgId, this._viewId);
  }

  getView(): IFuture<ZetkinView> {
    return this._repo.getView(this._orgId, this._viewId);
  }

  setCellValue<CellType>(personId: number, colId: number, data: CellType) {
    this._repo.setCellData(this._orgId, this._viewId, personId, colId, data);
  }
}
