import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from '../apiTypes';
import {
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
  callersLoad,
  callersLoaded,
  statsLoad,
  statsLoaded,
} from '../store';
import {
  IFuture,
  PromiseFuture,
  RemoteItemFuture,
  RemoteListFuture,
} from 'core/caching/futures';

export default class CallAssignmentsRepo {
  private _apiClient: IApiClient;
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

    if (!caItem || shouldLoad(caItem)) {
      this._store.dispatch(callAssignmentLoad(id));
      const promise = this._apiClient
        .get<CallAssignmentData>(`/api/orgs/${orgId}/call_assignments/${id}`)
        .then((data: CallAssignmentData) => {
          this._store.dispatch(callAssignmentLoaded(data));
          return data;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(caItem);
    }
  }

  getCallAssignmentCallers(
    orgId: number,
    id: number
  ): IFuture<CallAssignmentCaller[]> {
    const state = this._store.getState();
    const callersList = state.callAssignments.callersById[id];

    if (callersList) {
      return new RemoteListFuture(callersList);
    }

    this._store.dispatch(callersLoad(id));
    const promise = fetch(`/api/orgs/${orgId}/call_assignments/${id}/callers`)
      .then((res) => res.json())
      .then((data: { data: CallAssignmentCaller[] }) => {
        this._store.dispatch(callersLoaded({ callers: data.data, id }));
        return data.data;
      });

    return new PromiseFuture(promise);
  }

  getCallAssignmentStats(
    orgId: number,
    id: number
  ): IFuture<CallAssignmentStats> {
    const state = this._store.getState();
    const statsItem = state.callAssignments.statsById[id];

    if (shouldLoad(statsItem)) {
      this._store.dispatch(statsLoad(id));
      const promise = this._apiClient
        .get<CallAssignmentStats>(
          `/api/callAssignments/targets?org=${orgId}&assignment=${id}`
        )
        .then((data: CallAssignmentStats) => {
          this._store.dispatch(statsLoaded({ ...data, id: id }));
          return data;
        });

      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(statsItem);
    }
  }

  updateCallAssignment(
    orgId: number,
    id: number,
    data: Partial<CallAssignmentData>
  ): IFuture<CallAssignmentData> {
    const mutatingAttributes = Object.keys(data);

    this._store.dispatch(callAssignmentUpdate([id, mutatingAttributes]));
    const promise = this._apiClient
      .patch<CallAssignmentData>(
        `/api/orgs/${orgId}/call_assignments/${id}`,
        data
      )
      .then((data: CallAssignmentData) => {
        this._store.dispatch(callAssignmentUpdated([data, mutatingAttributes]));
        return data;
      });

    return new PromiseFuture(promise);
  }
}
