import dayjs from 'dayjs';
import Fuse from 'fuse.js';

import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import { Store } from 'core/store';
import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from '../apiTypes';
import { callAssignmentUpdate, callAssignmentUpdated } from '../store';
import {
  IFuture,
  PlaceholderFuture,
  ResolvedFuture,
} from 'core/caching/futures';
import { ZetkinPerson, ZetkinQuery, ZetkinTag } from 'utils/types/zetkin';

export enum CallAssignmentState {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  UNKNOWN = 'unknown',
}

export default class CallAssignmentModel extends ModelBase {
  private _env: Environment;
  private _id: number;
  private _orgId: number;
  private _repo: CallAssignmentsRepo;
  private _store: Store;

  addCaller(person: ZetkinPerson): void {
    this._repo.addCaller(this._orgId, this._id, person.id);
  }

  constructor(env: Environment, orgId: number, id: number) {
    super();
    this._env = env;
    this._store = this._env.store;
    this._orgId = orgId;
    this._id = id;
    this._repo = new CallAssignmentsRepo(env);
  }

  end(): void {
    const { data } = this.getData();
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    this._repo.updateCallAssignment(this._orgId, this._id, {
      end_date: today,
    });
  }

  getData(): IFuture<CallAssignmentData> {
    return this._repo.getCallAssignment(this._orgId, this._id);
  }

  getFilteredCallers(searchString = ''): IFuture<CallAssignmentCaller[]> {
    const callers = this._repo.getCallAssignmentCallers(this._orgId, this._id);

    if (callers.isLoading) {
      return callers;
    }

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

  removeCaller(callerId: number) {
    this._repo.removeCaller(this._orgId, this._id, callerId);
  }

  setCallerAccess(expose_target_details: boolean) {
    this._repo.updateCallAssignment(this._orgId, this._id, {
      expose_target_details,
    });
  }

  setCallerNotes(disable_caller_notes: boolean) {
    this._repo.updateCallAssignment(this._orgId, this._id, {
      disable_caller_notes,
    });
  }

  setCallerTags(
    callerId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ): void {
    this._repo.setCallerTags(
      this._orgId,
      this._id,
      callerId,
      prioTags,
      excludedTags
    );
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

  setDates(startDate: string | null, endDate: string | null): void {
    this._repo.updateCallAssignment(this._orgId, this._id, {
      end_date: endDate,
      start_date: startDate,
    });
  }

  setGoal(query: Partial<ZetkinQuery>) {
    // TODO: Refactor once SmartSearch is supported in redux framework
    const state = this._store.getState();
    const caItem = state.callAssignments.assignmentList.items.find(
      (item) => item.id == this._id
    );
    const callAssignment = caItem?.data;

    if (callAssignment) {
      this._store.dispatch(callAssignmentUpdate([this._id, ['goal']]));
      fetch(
        `/api/orgs/${this._orgId}/people/queries/${callAssignment.goal.id}`,
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
            callAssignmentUpdated([
              { ...callAssignment, goal: data.data },
              ['goal'],
            ])
          )
        );
    }
  }

  setTargets(query: Partial<ZetkinQuery>): void {
    // TODO: Refactor once SmartSearch is supported in redux framework
    const state = this._store.getState();
    const caItem = state.callAssignments.assignmentList.items.find(
      (item) => item.id == this._id
    );
    const callAssignment = caItem?.data;

    if (callAssignment) {
      this._store.dispatch(callAssignmentUpdate([this._id, ['target']]));
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
        .then((data: { data: ZetkinQuery }) => {
          this._store.dispatch(
            callAssignmentUpdated([
              { ...callAssignment, target: data.data },
              ['target'],
            ])
          );
        });
    }
  }

  setTitle(title: string): void {
    this._repo.updateCallAssignment(this._orgId, this._id, { title });
  }

  start(): void {
    const { data } = this.getData();
    if (!data) {
      return;
    }

    const now = dayjs();
    const today = now.format('YYYY-MM-DD');

    const { start_date: startStr, end_date: endStr } = data;

    if (!startStr && !endStr) {
      this._repo.updateCallAssignment(this._orgId, this._id, {
        start_date: today,
      });
    } else if (!startStr) {
      // End date is non-null
      const endDate = dayjs(endStr);
      if (endDate.isBefore(today)) {
        this._repo.updateCallAssignment(this._orgId, this._id, {
          end_date: null,
          start_date: today,
        });
      } else if (endDate.isAfter(today)) {
        this._repo.updateCallAssignment(this._orgId, this._id, {
          start_date: today,
        });
      }
    } else if (!endStr) {
      // Start date is non-null
      const startDate = dayjs(startStr);
      if (startDate.isAfter(today)) {
        // End date is null, start date is future
        this._repo.updateCallAssignment(this._orgId, this._id, {
          start_date: today,
        });
      }
    } else {
      // Start and end date are non-null
      const startDate = dayjs(startStr);
      const endDate = dayjs(endStr);

      if (
        (startDate.isBefore(today) || startDate.isSame(today)) &&
        (endDate.isBefore(today) || endDate.isSame(today))
      ) {
        // Start is past, end is past
        this._repo.updateCallAssignment(this._orgId, this._id, {
          end_date: null,
        });
      } else if (startDate.isAfter(today) && endDate.isAfter(today)) {
        // Start is future, end is future
        this._repo.updateCallAssignment(this._orgId, this._id, {
          start_date: today,
        });
      }
    }
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
