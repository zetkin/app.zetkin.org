import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import { Store } from 'core/store';
import { ZetkinOrganizerAction } from 'utils/types/zetkin';

export default class CallModel extends ModelBase {
  private _env: Environment;
  private _orgId: number;
  private _repo: CallAssignmentsRepo;
  private _store: Store;

  constructor(env: Environment, orgId: number) {
    super();
    this._env = env;
    this._store = this._env.store;
    this._orgId = orgId;
    this._repo = new CallAssignmentsRepo(env);
  }

  getUpdatedCalls(calls: [ZetkinOrganizerAction]) {
    const state = this._store.getState();
    // Return calls that are updated compared to the provided calls
    return state.callAssignments.callList.items.filter((item) => {
      const call = calls.find((c) => c.id == item.id);
      if (call) {
        return (
          new Date(item.data?.update_time || 0) >
          new Date(call?.update_time || 0)
        );
      } else {
        return false;
      }
    });
  }

  setOrganizerActionNeeded(callId: number) {
    this._repo.updateCall(this._orgId, callId, {
      organizer_action_taken: false,
    });
  }

  setOrganizerActionTaken(callId: number) {
    this._repo.updateCall(this._orgId, callId, {
      organizer_action_taken: true,
    });
  }
}
