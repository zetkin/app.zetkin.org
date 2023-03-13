import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import TasksRepo from '../repos/TasksRepo';
import { ZetkinTask } from '../components/types';

export default class TaskModel extends ModelBase {
  private _orgId: number;
  private _repo: TasksRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._repo = new TasksRepo(env);
  }

  getTask(taskId: number): IFuture<ZetkinTask> {
    return this._repo.getTask(this._orgId, taskId);
  }
}
