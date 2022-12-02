import { ApiResponse } from 'core/api/types';
import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { Store } from 'core/store';
import { CallAssignmentData, CallAssignmentStats } from '../apiTypes';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  statsLoad,
  statsLoaded,
} from '../store';
import { IFuture, PromiseFuture, ResolvedFuture } from 'core/caching/futures';

export default class CallAssignmentsRepo {
  private _apiClient: IApiClient;
  private _assignmentFuture: IFuture<CallAssignmentData> | null = null;
  private _statsFuture: IFuture<CallAssignmentStats> | null = null;
  private _store: Store;

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  getCallAssignment(orgId: number, id: number): IFuture<CallAssignmentData> {
    const state = this._store.getState();
    const caItem = state.callAssignments.assignmentList.items.find(
      (item) => item.id == id
    );
    const callAssignment = caItem?.data;

    if (callAssignment) {
      return new ResolvedFuture(callAssignment);
    } else if (this._assignmentFuture) {
      return this._assignmentFuture;
    } else {
      this._store.dispatch(callAssignmentLoad(id));
      const promise = this._apiClient
        .get<ApiResponse<CallAssignmentData>>(
          `/api/orgs/${orgId}/call_assignments/${id}`
        )
        .then((data: ApiResponse<CallAssignmentData>) => data.data)
        .then((data: CallAssignmentData) => {
          this._store.dispatch(callAssignmentLoaded(data));
          return data;
        });

      this._assignmentFuture = new PromiseFuture(promise);

      return this._assignmentFuture;
    }
  }

  getCallAssignmentStats(
    orgId: number,
    id: number
  ): IFuture<CallAssignmentStats> {
    const state = this._store.getState();
    const statsItem = state.callAssignments.statsById[id];

    if (statsItem?.data && !statsItem.isStale) {
      return new ResolvedFuture(statsItem.data);
    } else if (this._statsFuture) {
      return this._statsFuture;
    } else {
      this._store.dispatch(statsLoad(id));
      const promise = this._apiClient
        .get<CallAssignmentStats>(
          `/api/callAssignments/targets?org=${orgId}&assignment=${id}`
        )
        .then((data: CallAssignmentStats) => {
          this._store.dispatch(statsLoaded({ ...data, id: id }));
          return data;
        });

      this._statsFuture = new PromiseFuture(promise);
      return this._statsFuture;
    }
  }
}
