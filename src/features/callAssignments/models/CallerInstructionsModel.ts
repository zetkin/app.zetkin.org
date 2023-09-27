import { CallAssignmentData } from '../apiTypes';
import CallAssignmentsRepo from '../repos/CallAssignmentsRepo';
import Environment from 'core/env/Environment';
import { IFuture } from 'core/caching/futures';
import { ModelBase } from 'core/models';
import { Store } from 'core/store';

export default class CallerInstructionsModel extends ModelBase {
  private _id: number;
  private _key: string;
  private _orgId: number;
  private _repo: CallAssignmentsRepo;
  private _saveFuture: IFuture<CallAssignmentData>;
  private _store: Store;

  constructor(env: Environment, orgId: number, id: number) {
    super();

    this._id = id;
    this._orgId = orgId;
    this._key = `callerInstructions-${this._id}`;
    this._repo = new CallAssignmentsRepo(env);
    this._saveFuture = { data: null, error: null, isLoading: false };
    this._store = env.store;
  }

  get emptyInstrunctions(): boolean {
    const { data } = this._repo.getCallAssignment(this._orgId, this._id);
    return data?.instructions === '';
  }

  getInstructions(): string {
    const lsInstructions = localStorage.getItem(this._key) || '';

    const { data } = this._repo.getCallAssignment(this._orgId, this._id);

    if (lsInstructions === null) {
      if (data) {
        localStorage.setItem(this._key, data.instructions);
        return data.instructions;
      }
    }

    return lsInstructions;
  }

  get hasUnsavedChanges(): boolean {
    const { data } = this._repo.getCallAssignment(this._orgId, this._id);
    if (!data) {
      return false;
    }

    const lsInstructions = localStorage.getItem(this._key)?.trim() || '';
    const dataInstructions = data.instructions.trim();

    return dataInstructions != lsInstructions;
  }

  get isSaving(): boolean {
    const state = this._store.getState();

    const item = state.callAssignments.assignmentList.items.find(
      (item) => item.id === this._id
    );

    if (!item) {
      return false;
    }

    return item.mutating.includes('instructions');
  }

  revert(): void {
    const { data } = this._repo.getCallAssignment(this._orgId, this._id);

    if (!data) {
      return;
    }

    localStorage.setItem(this._key, data?.instructions);
    this.emitChange();
  }

  save(): IFuture<CallAssignmentData> {
    const lsInstructions = localStorage.getItem(this._key) || '';
    this._saveFuture = this._repo.updateCallAssignment(this._orgId, this._id, {
      instructions: lsInstructions,
    });

    return this._saveFuture;
  }

  setInstructions(instructions: string): void {
    localStorage.setItem(this._key, instructions);
    this.emitChange();
  }
}
