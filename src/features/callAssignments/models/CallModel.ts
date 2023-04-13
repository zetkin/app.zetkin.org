import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';

export default class CallModel extends ModelBase {
  private _orgId: number;
  private _repo: CallAssignmentsRepo;

  constructor(env: Environment, orgId: number) {
    super();
    this._orgId = orgId;
    this._repo = new CallAssignmentsRepo(env);
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
