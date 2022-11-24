import { Store } from 'core/store';
import { CallAssignmentData, CallAssignmentStats } from '../apiTypes';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdated,
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

  get statsIsLoading() {
    return (
      this._store.getState().callAssignments.statsById[this._id]?.isLoading ??
      false
    );
  }
}
