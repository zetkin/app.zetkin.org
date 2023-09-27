import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import { Store } from 'core/store';
import { CallAssignmentData, CallAssignmentStats } from '../apiTypes';
import {
  IFuture,
  PlaceholderFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export default class CallAssignmentModel extends ModelBase {
  private _env: Environment;
  private _id: number;
  private _orgId: number;
  private _repo: CallAssignmentsRepo;
  private _store: Store;

  constructor(env: Environment, orgId: number, id: number) {
    super();
    this._env = env;
    this._store = this._env.store;
    this._orgId = orgId;
    this._id = id;
    this._repo = new CallAssignmentsRepo(env);
  }

  getData(): IFuture<CallAssignmentData> {
    return this._repo.getCallAssignment(this._orgId, this._id);
  }

  getStats(): IFuture<CallAssignmentStats | null> {
    if (!this.isTargeted) {
      return new ResolvedFuture(null);
    }

    const future = this._repo.getCallAssignmentStats(this._orgId, this._id);
    if (future.isLoading && !future.data) {
      return new PlaceholderFuture({
        allTargets: 0,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        callsMade: 0,
        done: 0,
        id: this._id,
        missingPhoneNumber: 0,
        mostRecentCallTime: null,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 0,
      });
    } else {
      return future;
    }
  }

  get isTargeted() {
    const { data } = this.getData();
    return data && data.target?.filter_spec?.length != 0;
  }
}
