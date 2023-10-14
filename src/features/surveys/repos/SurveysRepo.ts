import Environment from 'core/env/Environment';
import IApiClient from 'core/api/client/IApiClient';
import { loadListIfNecessary } from 'core/caching/cacheUtils';
import shouldLoad from 'core/caching/shouldLoad';
import { Store } from 'core/store';
import {
  elementOptionDeleted,
  elementOptionsReordered,
  elementOptionUpdated,
  elementsReordered,
  surveyCreate,
  surveyCreated,
  surveyLoad,
  surveyLoaded,
  surveysLoad,
  surveysLoaded,
} from '../store';
import { IFuture, PromiseFuture, RemoteItemFuture } from 'core/caching/futures';
import {
  ZetkinSurvey,
  ZetkinSurveyElementOrder,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveyPostBody,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';

export type ZetkinSurveyElementPatchBody =
  | ZetkinSurveyTextElementPatchBody
  | OptionsQuestionPatchBody
  | TextQuestionPatchBody;

type ZetkinSurveyTextElementPatchBody = {
  hidden?: boolean;
  text_block?: {
    content?: string;
    header?: string;
  };
};

export type TextQuestionPatchBody = {
  question: Partial<ZetkinTextQuestion>;
};

export type OptionsQuestionPatchBody = {
  question: {
    description?: string | null;
    options?: ZetkinSurveyOption[];
    question?: string;
    response_config?: {
      widget_type: 'checkbox' | 'radio' | 'select';
    };
  };
};

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

  async deleteElementOption(
    orgId: number,
    surveyId: number,
    elemId: number,
    optionId: number
  ) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options/${optionId}`
    );
    this._store.dispatch(elementOptionDeleted([surveyId, elemId, optionId]));
  }

  getSurvey(orgId: number, id: number): IFuture<ZetkinSurvey> {
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

  async updateElementOption(
    orgId: number,
    surveyId: number,
    elemId: number,
    optionId: number,
    text: string
  ) {
    const option = await this._apiClient.patch<ZetkinSurveyOption>(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options/${optionId}`,
      { text }
    );
    this._store.dispatch(
      elementOptionUpdated([surveyId, elemId, optionId, option])
    );
  }

  async updateElementOrder(
    orgId: number,
    surveyId: number,
    ids: (string | number)[]
  ) {
    const newOrder = await this._apiClient.patch<ZetkinSurveyElementOrder>(
      `/api/orgs/${orgId}/surveys/${surveyId}/element_order`,
      {
        default: ids.map((id) => parseInt(id as string)),
      }
    );

    this._store.dispatch(elementsReordered([surveyId, newOrder]));
  }

  async updateOptionOrder(
    orgId: number,
    surveyId: number,
    elemId: number,
    ids: (string | number)[]
  ) {
    const newOrder = await this._apiClient.patch<ZetkinSurveyElementOrder>(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/option_order`,
      {
        default: ids.map((id) => parseInt(id as string)),
      }
    );

    this._store.dispatch(elementOptionsReordered([surveyId, elemId, newOrder]));
  }
}
