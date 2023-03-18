import { Store } from '@reduxjs/toolkit';

import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import {
  callAssignmentCreate,
  callAssignmentCreated,
  surveyCreate,
  surveyCreated,
} from '../store';
import {
  ZetkinCallAssignment,
  ZetkinCallAssignmentPostBody,
  ZetkinSurvey,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';

export default class CampaignRepo {
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

  async createSurvey(
    surveyBody: ZetkinSurveyPostBody,
    orgId: number,
    campaignId: number
  ): Promise<ZetkinSurvey> {
    this._store.dispatch(surveyCreate());
    const survey = await this._apiClient.post<
      ZetkinSurvey,
      ZetkinSurveyPostBody
    >(`/api/orgs/${orgId}/campaigns/${campaignId}/surveys`, surveyBody);

    this._store.dispatch(surveyCreated(survey));
    return survey;
  }
}
