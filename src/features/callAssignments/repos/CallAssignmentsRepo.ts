import { BodySchema } from 'pages/api/callAssignments/setCallerTags';
import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  CallAssignmentCaller,
  CallAssignmentData,
  CallAssignmentStats,
} from '../apiTypes';
import {
  callAssignmentCreate,
  callAssignmentCreated,
  callAssignmentLoad,
  callAssignmentLoaded,
  callAssignmentsLoad,
  callAssignmentsLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
  callerAdd,
  callerAdded,
  callerConfigure,
  callerConfigured,
  callerRemove,
  callerRemoved,
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
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPostBody,
  ZetkinTag,
} from '../../../utils/types/zetkin';

export default class CallAssignmentsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  addCaller(orgId: number, id: number, callerId: number) {
    this._store.dispatch(callerAdd([id, callerId]));
    const promise = this._apiClient
      .put<CallAssignmentCaller>(
        `/api/orgs/${orgId}/call_assignments/${id}/callers/${callerId}`
      )
      .then((data) => {
        this._store.dispatch(callerAdded([id, data]));
        return data;
      });

    return new PromiseFuture(promise);
  }

  constructor(env: Environment) {
    this._apiClient = env.apiClient;
    this._store = env.store;
  }

  async createCallAssignment(
    callAssignmentBody: ZetkinCallAssignmentPostBody,
    orgId: number,
    campaignId: number
  ): Promise<ZetkinCallAssignment> {
    this._store.dispatch(callAssignmentCreate());
    const assignment = await this._apiClient.post<
      ZetkinCallAssignment,
      ZetkinCallAssignmentPostBody
    >(
      `/api/orgs/${orgId}/campaigns/${campaignId}/call_assignments`,
      callAssignmentBody
    );

    this._store.dispatch(callAssignmentCreated(assignment));
    return assignment;
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

  getCallAssignments(orgId: number): IFuture<CallAssignmentData[]> {
    const state = this._store.getState();
    const assignmentList = state.callAssignments.assignmentList;

    return loadListIfNecessary(assignmentList, this._store, {
      actionOnLoad: () => callAssignmentsLoad(),
      actionOnSuccess: (data) => callAssignmentsLoaded(data),
      loader: () =>
        this._apiClient.get<CallAssignmentData[]>(
          `/api/orgs/${orgId}/call_assignments/`
        ),
    });
  }

  removeCaller(orgId: number, id: number, callerId: number) {
    this._store.dispatch(callerRemove([id, callerId]));
    this._apiClient
      .delete(`/api/orgs/${orgId}/call_assignments/${id}/callers/${callerId}`)
      .then(() => {
        this._store.dispatch(callerRemoved([id, callerId]));
      });
  }

  setCallerTags(
    orgId: number,
    assignmentId: number,
    callerId: number,
    prioTags: ZetkinTag[],
    excludedTags: ZetkinTag[]
  ) {
    this._store.dispatch(callerConfigure([assignmentId, callerId]));
    this._apiClient
      .post<CallAssignmentCaller, BodySchema>(
        `/api/callAssignments/setCallerTags`,
        {
          assignmentId,
          callerId,
          excludedTags: excludedTags.map((tag) => tag.id),
          orgId,
          prioTags: prioTags.map((tag) => tag.id),
        }
      )
      .then((data: CallAssignmentCaller) => {
        this._store.dispatch(callerConfigured([assignmentId, data]));
      });
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
