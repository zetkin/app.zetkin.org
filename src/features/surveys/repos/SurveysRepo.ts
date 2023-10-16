import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { IFuture } from 'core/caching/futures';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import { Store } from 'core/store';
import {
  surveyCreate,
  surveyCreated,
  surveysLoad,
  surveysLoaded,
} from '../store';
import {
  ZetkinSurvey,
  ZetkinSurveyExtended,
  ZetkinSurveyPostBody,
} from 'utils/types/zetkin';

export default class SurveysRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  async createSurvey(
    surveyBody: ZetkinSurveyPostBody,
    orgId: number,
    campaignId: number
  ): Promise<ZetkinSurvey> {
    this._store.dispatch(surveyCreate());
    const survey = await this._apiClient.post<
      ZetkinSurveyExtended,
      ZetkinSurveyPostBody
    >(`/api/orgs/${orgId}/campaigns/${campaignId}/surveys`, surveyBody);

    this._store.dispatch(surveyCreated(survey));
    return survey;
  }

  getSurveys(orgId: number): IFuture<ZetkinSurvey[]> {
    const state = this._store.getState();
    const surveyList = state.surveys.surveyList;

    return loadListIfNecessary(surveyList, this._store.dispatch, {
      actionOnLoad: () => surveysLoad(),
      actionOnSuccess: (data) => surveysLoaded(data),
      loader: () =>
        this._apiClient.get<ZetkinSurveyExtended[]>(
          `/api/orgs/${orgId}/surveys/`
        ),
    });
  }
}
