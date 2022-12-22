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
  private _saveFuture: IFuture<CallAssignmentData>;

  constructor(env: Environment, id: number, orgId: number) {
    this._id = id;
    this._orgId = orgId;
    this._key = `callerInstructions-${this._id}`;
    this._repo = new CallAssignmentsRepo(env);
    this._saveFuture = { data: null, error: null, isLoading: false };

    const instructions = localStorage.getItem(this._key);

    this._instructions = instructions || '';
  }

  getInstructions(): string {
    this._instructions = localStorage.getItem(this._key) || '';
    return this._instructions;
  }

  get isSaving(): boolean {
    return this._saveFuture.isLoading;
  }

  save(): IFuture<CallAssignmentData> {
    this._saveFuture = this._repo.updateCallAssignment(this._orgId, this._id, {
      instructions: this._instructions,
    });

    return this._saveFuture;
  }

  setInstructions(instructions: string): void {
    if (instructions != this._instructions) {
      this._instructions = instructions;
      localStorage.setItem(this._key, this._instructions);
    }
  }
}
