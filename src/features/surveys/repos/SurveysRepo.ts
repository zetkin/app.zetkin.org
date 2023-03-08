import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  ELEMENT_TYPE,
  ZetkinOptionsQuestion,
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
  ZetkinSurveySubmissionPatchBody,
  ZetkinSurveyTextElement,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';
import {
  elementAdded,
  elementDeleted,
  elementUpdated,
  submissionLoad,
  submissionLoaded,
  surveyLoad,
  surveyLoaded,
  surveySubmissionsLoad,
  surveySubmissionsLoaded,
  surveySubmissionUpdate,
  surveySubmissionUpdated,
  surveyUpdate,
  surveyUpdated,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';

export type ZetkinSurveyElementPostBody =
  | Partial<Omit<ZetkinSurveyTextElement, 'id'>>
  | ZetkinSurveyTextQuestionElementPostBody
  | ZetkinSurveyOptionsQuestionElementPostBody;

type ZetkinSurveyTextQuestionElementPostBody = {
  hidden: boolean;
  question: Omit<ZetkinTextQuestion, 'required'>;
  type: ELEMENT_TYPE.QUESTION;
};

type ZetkinSurveyOptionsQuestionElementPostBody = {
  hidden: boolean;
  question: Omit<ZetkinOptionsQuestion, 'required'>;
  type: ELEMENT_TYPE.QUESTION;
};

export type ZetkinSurveyElementPatchBody =
  | ZetkinSurveyTextElementPatchBody
  | Partial<Omit<ZetkinSurveyOptionsQuestionElementPostBody, 'type'>>
  | Partial<Omit<ZetkinSurveyTextQuestionElementPostBody, 'type'>>;

type ZetkinSurveyTextElementPatchBody = {
  hidden?: boolean;
  text_block?: {
    content?: string;
    header?: string;
  };
};

export default class SurveysRepo {
  private _apiClient: IApiClient;
  private _store: Store;

  async addElement(
    orgId: number,
    surveyId: number,
    data: ZetkinSurveyElementPostBody
  ) {
    await this._apiClient
      .post<ZetkinSurveyElement, ZetkinSurveyElementPostBody>(
        `/api/orgs/${orgId}/surveys/${surveyId}/elements`,
        data
      )
      .then((newElement) => {
        this._store.dispatch(elementAdded([surveyId, newElement]));
      });
  }

  constructor(env: Environment) {
    this._store = env.store;
    this._apiClient = env.apiClient;
  }

  async deleteSurveyElement(orgId: number, surveyId: number, elemId: number) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`
    );
    this._store.dispatch(elementDeleted([surveyId, elemId]));
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

  getSurveySubmissions(
    orgId: number,
    surveyId: number
  ): IFuture<ZetkinSurveySubmission[]> {
    const state = this._store.getState();
    return loadListIfNecessary(state.surveys.submissionList, this._store, {
      actionOnLoad: () => surveySubmissionsLoad(surveyId),
      actionOnSuccess: (data) => surveySubmissionsLoaded([surveyId, data]),
      loader: () =>
        this._apiClient.get<ZetkinSurveySubmission[]>(
          `/api/orgs/${orgId}/surveys/${surveyId}/submissions`
        ),
    });
  }

  async updateElement(
    orgId: number,
    surveyId: number,
    elemId: number,
    data: ZetkinSurveyElementPatchBody
  ) {
    const element = await this._apiClient.patch<
      ZetkinSurveyElement,
      ZetkinSurveyElementPatchBody
    >(`/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`, data);
    this._store.dispatch(elementUpdated([surveyId, elemId, element]));
  }

  updateSurvey(
    orgId: number,
    surveyId: number,
    data: Partial<Omit<ZetkinSurvey, 'id'>>
  ) {
    this._store.dispatch(surveyUpdate([surveyId, Object.keys(data)]));
    this._apiClient
      .patch<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`,
        data
      )
      .then((survey) => {
        this._store.dispatch(surveyUpdated(survey));
      });
  }

  updateSurveySubmission(
    orgId: number,
    submissionId: number,
    data: ZetkinSurveySubmissionPatchBody
  ) {
    this._store.dispatch(
      surveySubmissionUpdate([submissionId, Object.keys(data)])
    );
    this._apiClient
      .patch<ZetkinSurveySubmission, ZetkinSurveySubmissionPatchBody>(
        `/api/orgs/${orgId}/survey_submissions/${submissionId}`,
        data
      )
      .then((submission) => {
        this._store.dispatch(surveySubmissionUpdated(submission));
      });
  }
}
