import { CallAssignmentData } from '../apiTypes';
import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { Store } from 'core/store';
import {
  callAssignmentCreate,
  callAssignmentCreated,
  callAssignmentsLoad,
  callAssignmentsLoaded,
  callAssignmentUpdate,
  callAssignmentUpdated,
} from '../store';
import { IFuture, PromiseFuture } from 'core/caching/futures';
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPostBody,
} from '../../../utils/types/zetkin';

export default class CallAssignmentsRepo {
  private _apiClient: IApiClient;
  private _store: Store;

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
