import { Store } from 'core/store';
import { CallAssignmentData, CallAssignmentStats } from '../apiTypes';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
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

  getStats(): CallAssignmentStats {
    const state = this._store.getState();
    const stats = state.callAssignments.statsById[this._id];

    if (stats) {
      return stats;
    } else {
      this._store.dispatch(statsLoad());
      const promise = fetch(
        `/api/callAssignments/targets?org=${this._orgId}&assignment=${this._id}`
      )
        .then((res) => res.json())
        .then((data: CallAssignmentStats) => {
          this._store.dispatch(statsLoaded({ ...data, id: this._id }));
        });

      throw promise;
    }
  }

  get isLoading() {
    return this._store.getState().callAssignments.isLoading;
  }
}
