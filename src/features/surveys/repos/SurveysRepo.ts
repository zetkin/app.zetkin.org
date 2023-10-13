import addBulkOptions from '../rpc/addBulkOptions';
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
  ZetkinSurveyElementOrder,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveyPostBody,
  ZetkinSurveyTextElement,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';
import {
  elementAdded,
  elementDeleted,
  elementOptionAdded,
  elementOptionDeleted,
  elementOptionsReordered,
  elementOptionUpdated,
  elementsLoad,
  elementsLoaded,
  elementsReordered,
  elementUpdated,
  surveyCreate,
  surveyCreated,
  surveyLoad,
  surveyLoaded,
  surveysLoad,
  surveysLoaded,
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
  question: Omit<ZetkinOptionsQuestion, 'required' | 'options'> & {
    options?: string[];
  };
  type: ELEMENT_TYPE.QUESTION;
};

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

  async addElement(
    orgId: number,
    surveyId: number,
    data: ZetkinSurveyElementPostBody
  ) {
    return await this._apiClient
      .post<ZetkinSurveyElement, ZetkinSurveyElementPostBody>(
        `/api/orgs/${orgId}/surveys/${surveyId}/elements`,
        data
      )
      .then((newElement) => {
        this._store.dispatch(elementAdded([surveyId, newElement]));
        return newElement;
      });
  }

  async addElementOption(orgId: number, surveyId: number, elemId: number) {
    const option = await this._apiClient.post<ZetkinSurveyOption>(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}/options`,
      { text: '' }
    );
    this._store.dispatch(elementOptionAdded([surveyId, elemId, option]));
  }

  async addElementOptions(
    orgId: number,
    surveyId: number,
    elemId: number,
    options: string[]
  ) {
    const result = await this._apiClient.rpc(addBulkOptions, {
      elemId,
      options,
      orgId,
      surveyId,
    });

    result.addedOptions.forEach((option) => {
      this._store.dispatch(elementOptionAdded([surveyId, elemId, option]));
    });

    result.removedOptions.forEach((option) => {
      this._store.dispatch(elementOptionDeleted([surveyId, elemId, option.id]));
    });
  }

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

  async deleteSurveyElement(orgId: number, surveyId: number, elemId: number) {
    await this._apiClient.delete(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`
    );
    this._store.dispatch(elementDeleted([surveyId, elemId]));
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

  getSurveyElements(
    orgId: number,
    surveyId: number
  ): IFuture<ZetkinSurveyElement[]> {
    const state = this._store.getState();
    return loadListIfNecessary<
      ZetkinSurveyElement,
      number,
      [number, ZetkinSurveyElement[]]
    >(state.surveys.elementsBySurveyId[surveyId], this._store.dispatch, {
      actionOnLoad: () => elementsLoad(surveyId),
      actionOnSuccess: (elements) => elementsLoaded([surveyId, elements]),
      loader: async () => {
        const survey = await this._apiClient.get<ZetkinSurveyExtended>(
          `/api/orgs/${orgId}/surveys/${surveyId}`
        );
        return survey.elements;
      },
    });
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
}
