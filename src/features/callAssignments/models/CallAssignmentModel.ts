import { CallAssignmentData } from '../apiTypes';
import { Store } from 'core/store';
import { callAssignmentLoad, callAssignmentLoaded } from '../store';

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
        .then((res) => res.json())
        .then((data: { data: CallAssignmentData }) => {
          this._store.dispatch(callAssignmentLoaded(data.data));
        });

      throw promise;
    }
  }

  get isLoading() {
    return this._store.getState().callAssignments.isLoading;
  }
}
