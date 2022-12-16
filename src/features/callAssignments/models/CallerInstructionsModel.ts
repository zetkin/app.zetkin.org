import { CallAssignmentData } from '../apiTypes';
import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';

export default class CallerInstructionsModel {
  private _id: number;
  private _instructions: string;
  private _key: string;
  private _orgId: number;
  private _repo: CallAssignmentsRepo;

  constructor(env: Environment, id: number, orgId: number) {
    this._id = id;
    this._orgId = orgId;
    this._key = `callerInstructions-${this._orgId}-${this._id}`;
    this._repo = new CallAssignmentsRepo(env);

    const instructions = localStorage.getItem(this._key);

    this._instructions = instructions || '';
  }

  getInstructions(): string {
    return this._instructions;
  }

  save(): IFuture<CallAssignmentData> {
    return this._repo.updateCallAssignment(this._orgId, this._id, {
      instructions: this._instructions,
    });
  }

  setInstructions(instructions: string): void {
    if (instructions != this._instructions) {
      this._instructions = instructions;
      localStorage.setItem(this._key, this._instructions);
    }
  }
}
