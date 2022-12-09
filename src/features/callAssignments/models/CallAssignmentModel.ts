import Fuse from 'fuse.js';

import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { Store } from 'core/store';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from '../apiTypes';
import { callAssignmentLoad, callAssignmentUpdated } from '../store';
import {
  IFuture,
  PlaceholderFuture,
  ResolvedFuture,
} from 'core/caching/futures';

export enum CallAssignmentState {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default class CallAssignmentModel {
  private _env: Environment;
  private _id: number;
  private _orgId: number;
  private _repo: CallAssignmentsRepo;
  private _store: Store;

  constructor(env: Environment, orgId: number, id: number) {
    this._env = env;
    this._store = this._env.store;
    this._orgId = orgId;
    this._id = id;
    this._repo = new CallAssignmentsRepo(env);
  }

  getData(): IFuture<CallAssignmentData> {
    return this._repo.getCallAssignment(this._orgId, this._id);
  }

  getFilteredCallers(searchString: string): IFuture<CallAssignmentCaller[]> {
    const callers = this._repo.getCallAssignmentCallers(this._orgId, this._id);

    if (callers.data && searchString) {
      const fuse = new Fuse(callers.data, {
        includeScore: true,
        keys: ['first_name', 'last_name'],
        threshold: 0.4,
      });

      const filteredCallers = fuse
        .search(searchString)
        .map((fuseResult) => fuseResult.item);

      return new ResolvedFuture(filteredCallers);
    }

    return new ResolvedFuture(callers.data || []);
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

  get hasTargets() {
    const { data } = this.getStats();
    if (data === null) {
      return false;
    }
    return data.blocked + data.ready + data.done > 0;
  }

  get isTargeted() {
    const { data } = this.getData();
    return data && data.target?.filter_spec?.length != 0;
  }

  setCooldown(cooldown: number): void {
    const state = this._store.getState();
    const caItem = state.callAssignments.assignmentList.items.find(
      (item) => item.id == this._id
    );
    const callAssignment = caItem?.data;

    //if cooldown has not changed, do nothing.
    if (cooldown === callAssignment?.cooldown) {
      return;
    }

    this._repo.updateCallAssignment(this._orgId, this._id, { cooldown });
  }

  setTargets(query: Partial<ZetkinQuery>): void {
    // TODO: Refactor once SmartSearch is supported in redux framework
    const state = this._store.getState();
    const caItem = state.callAssignments.assignmentList.items.find(
      (item) => item.id == this._id
    );
    const callAssignment = caItem?.data;

    if (callAssignment) {
      this._store.dispatch(callAssignmentLoad(this._id));
      fetch(
        `/api/orgs/${this._orgId}/people/queries/${callAssignment.target.id}`,
        {
          body: JSON.stringify(query),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        }
      )
        .then((res) => res.json())
        .then((data: { data: ZetkinQuery }) =>
          this._store.dispatch(
            callAssignmentUpdated({ ...callAssignment, target: data.data })
          )
        );
    }
  }

  setTitle(title: string): void {
    this._repo.updateCallAssignment(this._orgId, this._id, { title });
  }

  get state(): CallAssignmentState {
    const { data } = this.getData();
    if (!data) {
      return CallAssignmentState.UNKNOWN;
    }

    if (data.start_date) {
      const startDate = new Date(data.start_date);
      const now = new Date();
      if (startDate > now) {
        return CallAssignmentState.SCHEDULED;
      } else {
        if (data.end_date) {
          const endDate = new Date(data.end_date);
          if (endDate < now) {
            return CallAssignmentState.CLOSED;
          }
        }

        const { data: statsData } = this.getStats();
        if (!statsData?.mostRecentCallTime) {
          return CallAssignmentState.OPEN;
        }

        const mostRecentCallTime = new Date(statsData.mostRecentCallTime);
        const diff = now.getTime() - mostRecentCallTime.getTime();

        return diff < 10 * 60 * 1000
          ? CallAssignmentState.ACTIVE
          : CallAssignmentState.OPEN;
      }
    } else {
      return CallAssignmentState.DRAFT;
    }
  }
}
