import Fuse from 'fuse.js';

import { Store } from 'core/store';
import { ZetkinQuery } from 'utils/types/zetkin';
import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from '../apiTypes';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdated,
  callersLoad,
  callersLoaded,
  statsLoad,
  statsLoaded,
} from '../store';

export default class CallAssignmentModel {
  private _id: number;
  private _orgId: number;
  private _store: Store;

  constructor(store: Store, orgId: number, id: number) {
    this._store = store;
    this._orgId = orgId;
    this._id = id;
  }

  getCallers(): CallAssignmentCaller[] {
    const state = this._store.getState();
    const callers = state.callAssignments.callersById[this._id];

    if (callers) {
      return callers;
    } else {
      this._store.dispatch(callersLoad(this._id));
      fetch(`/api/orgs/${this._orgId}/call_assignments/${this._id}/callers`)
        .then((res) => res.json())
        .then((data: { data: CallAssignmentCaller[] }) => {
          this._store.dispatch(
            callersLoaded({ callers: data.data, id: this._id })
          );
        });
    }
    return [];
  }

  getData(): CallAssignmentData {
    const state = this._store.getState();
    const callAssignment = state.callAssignments.callAssignments.find(
      (ca) => ca.id == this._id
    );
    if (callAssignment) {
      return callAssignment;
    } else {
      this._store.dispatch(callAssignmentLoad());
      const promise = fetch(
        `/api/orgs/${this._orgId}/call_assignments/${this._id}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data: { data: CallAssignmentData }) => {
          this._store.dispatch(callAssignmentLoaded(data.data));
        });

      throw promise;
    }
  }

  getFilteredCallers(searchString: string): CallAssignmentCaller[] {
    const state = this._store.getState();
    const callers = state.callAssignments.callersById[this._id];

    if (callers && searchString) {
      //search the callers in state
      const fuse = new Fuse(callers, {
        includeScore: true,
        keys: ['first_name', 'last_name'],
        threshold: 0.4,
      });
      return fuse
        .search(searchString)
        .map((fuseResult) => fuseResult.item) as CallAssignmentCaller[];
    } else if (!callers && searchString) {
      //load callers, search and set state to the search results
      this._store.dispatch(callersLoad(this._id));

      fetch(`/api/orgs/${this._orgId}/call_assignments/${this._id}/callers`)
        .then((res) => res.json())
        .then((data: { data: CallAssignmentCaller[] }) => {
          const fuse = new Fuse(data.data, {
            includeScore: true,
            keys: ['first_name', 'last_name'],
            threshold: 0.4,
          });
          const filtered = fuse
            .search(searchString)
            .map((fuseResult) => fuseResult.item) as CallAssignmentCaller[];
          this._store.dispatch(
            callersLoaded({ callers: filtered, id: this._id })
          );
        });
    }
    return [];
  }

  getStats(): CallAssignmentStats | null {
    const state = this._store.getState();
    const stats = state.callAssignments.statsById[this._id];

    if (!this.isTargeted) {
      return null;
    }

    if (stats && !stats.isStale) {
      return stats;
    } else {
      this._store.dispatch(statsLoad(this._id));
      fetch(
        `/api/callAssignments/targets?org=${this._orgId}&assignment=${this._id}`
      )
        .then((res) => res.json())
        .then((data: CallAssignmentStats) => {
          this._store.dispatch(statsLoaded({ ...data, id: this._id }));
        });

      return {
        allTargets: 0,
        allocated: 0,
        blocked: 0,
        callBackLater: 0,
        calledTooRecently: 0,
        done: 0,
        isLoading: true,
        isStale: false,
        missingPhoneNumber: 0,
        organizerActionNeeded: 0,
        queue: 0,
        ready: 0,
      };
    }
  }

  get hasTargets() {
    const data = this.getStats();
    if (data === null) {
      return false;
    }
    return data.blocked + data.ready + data.done > 0;
  }

  get isLoading() {
    return this._store.getState().callAssignments.isLoading;
  }

  get isTargeted() {
    const data = this.getData();
    return data.target.filter_spec?.length != 0;
  }

  setCooldown(cooldown: number) {
    const state = this._store.getState();
    const callAssignment = state.callAssignments.callAssignments.find(
      (ca) => ca.id == this._id
    );

    //if cooldown has not changed, do nothing.
    if (cooldown === callAssignment?.cooldown) {
      return null;
    }

    if (callAssignment) {
      this._store.dispatch(callAssignmentLoad());
      fetch(`/api/orgs/${this._orgId}/call_assignments/${this._id}`, {
        body: JSON.stringify({ cooldown }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      })
        .then((res) => {
          return res.json();
        })
        .then((data: { data: CallAssignmentData }) => {
          this._store.dispatch(callAssignmentUpdated(data.data));
        });
    }
  }

  setTargets(query: Partial<ZetkinQuery>) {
    const state = this._store.getState();
    const callAssignment = state.callAssignments.callAssignments.find(
      (ca) => ca.id == this._id
    );
    if (callAssignment) {
      this._store.dispatch(callAssignmentLoad());
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

  get statsIsLoading() {
    return (
      this._store.getState().callAssignments.statsById[this._id]?.isLoading ??
      false
    );
  }
}
