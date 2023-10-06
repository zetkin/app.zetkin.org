import { CallAssignmentData } from '../apiTypes';
import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { Store } from 'core/store';
import { callAssignmentsLoad, callAssignmentsLoaded } from '../store';

export default class CallAssignmentsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getCallAssignments(orgId: number): IFuture<CallAssignmentData[]> {
    const state = this._store.getState();
    const assignmentList = state.callAssignments.assignmentList;

    return loadListIfNecessary(assignmentList, this._store.dispatch, {
      actionOnLoad: () => callAssignmentsLoad(),
      actionOnSuccess: (data) => callAssignmentsLoaded(data),
      loader: () =>
        this._apiClient.get<CallAssignmentData[]>(
          `/api/orgs/${orgId}/call_assignments/`
        ),
    });
  }
}
