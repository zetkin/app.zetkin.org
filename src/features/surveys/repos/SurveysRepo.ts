import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import {
  submissionLoad,
  submissionLoaded,
  surveyLoad,
  surveyLoaded,
} from '../store';
import {
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';

export default class SurveysRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  getSubmission(orgId: number, id: number): IFuture<ZetkinSurveySubmission> {
    const state = this._store.getState();
    const item = state.surveys.submissionList.items.find(
      (item) => item.id == id
    );

    if (!item || shouldLoad(item)) {
      this._store.dispatch(submissionLoad(id));
      const promise = this._apiClient
        .get<ZetkinSurveySubmission>(
          `/api/orgs/${orgId}/survey_submissions/${id}`
        )
        .then((sub) => {
          this._store.dispatch(submissionLoaded(sub));
          return sub;
        });
      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(item);
    }
  }

  getSurvey(orgId: number, id: number): IFuture<ZetkinSurveyExtended> {
    const state = this._store.getState();
    const item = state.surveys.surveyList.items.find((item) => item.id == id);
    if (!item || shouldLoad(item)) {
      this._store.dispatch(surveyLoad(id));
      const promise = this._apiClient
        .get<ZetkinSurveyExtended>(`/api/orgs/${orgId}/surveys/${id}`)
        .then((survey) => {
          this._store.dispatch(surveyLoaded(survey));
          return survey;
        });
      return new PromiseFuture(promise);
    } else {
      return new RemoteItemFuture(item);
    }
  }
}
