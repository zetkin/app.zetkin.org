import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import TasksRepo from '../repos/TasksRepo';
import { TaskStats } from '../rpc/getTaskStats';
import { ZetkinTask } from '../components/types';

export default class TaskModel extends ModelBase {
  private _orgId: number;
  private _repo: TasksRepo;
  private _taskId: number;

  constructor(env: Environment, orgId: number, taskId: number) {
    super();
    this._orgId = orgId;
    this._repo = new TasksRepo(env);
    this._taskId = taskId;
  }

  getTask(): IFuture<ZetkinTask> {
    return this._repo.getTask(this._orgId, this._taskId);
  }

  getTaskStats(): IFuture<TaskStats> {
    return this._repo.getTaskStats(this._orgId, this._taskId);
  }
}
