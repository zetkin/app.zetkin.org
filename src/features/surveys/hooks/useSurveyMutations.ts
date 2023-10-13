import {
  ELEMENT_TYPE,
  ZetkinOptionsQuestion,
  ZetkinSurvey,
  ZetkinSurveyElement,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveyTextElement,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';
import {
  elementAdded,
  elementDeleted,
  elementUpdated,
  surveyUpdate,
  surveyUpdated,
} from '../store';
import { useApiClient, useAppDispatch } from 'core/hooks';

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

export type ZetkinSurveyElementPostBody =
  | Partial<Omit<ZetkinSurveyTextElement, 'id'>>
  | ZetkinSurveyTextQuestionElementPostBody
  | ZetkinSurveyOptionsQuestionElementPostBody;

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

type ZetkinSurveyPatchBody = Partial<Omit<ZetkinSurvey, 'id'>>;

type UseSurveyEditingReturn = {
  addElement: (data: ZetkinSurveyElementPostBody) => Promise<void>;
  deleteElement: (elemId: number) => Promise<void>;
  updateElement: (
    elemId: number,
    data: ZetkinSurveyElementPatchBody
  ) => Promise<void>;
  updateSurvey: (data: ZetkinSurveyPatchBody) => Promise<void>;
};

export default function useSurveyMutations(
  orgId: number,
  surveyId: number
): UseSurveyEditingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  async function updateSurvey(data: ZetkinSurveyPatchBody) {
    dispatch(surveyUpdate([surveyId, Object.keys(data)]));
    apiClient
      .patch<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`,
        data
      )
      .then((survey) => {
        dispatch(surveyUpdated(survey));
      });
  }

  async function addElement(data: ZetkinSurveyElementPostBody) {
    apiClient
      .post<ZetkinSurveyElement, ZetkinSurveyElementPostBody>(
        `/api/orgs/${orgId}/surveys/${surveyId}/elements`,
        data
      )
      .then((newElement) => {
        dispatch(elementAdded([surveyId, newElement]));
        return newElement;
      });
  }
  async function deleteElement(elemId: number) {
    await apiClient.delete(
      `/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`
    );
    dispatch(elementDeleted([surveyId, elemId]));
  }
  async function updateElement(
    elemId: number,
    data: ZetkinSurveyElementPatchBody
  ) {
    const element = await apiClient.patch<
      ZetkinSurveyElement,
      ZetkinSurveyElementPatchBody
    >(`/api/orgs/${orgId}/surveys/${surveyId}/elements/${elemId}`, data);
    dispatch(elementUpdated([surveyId, elemId, element]));
  }

  return {
    addElement,
    deleteElement,
    updateElement,
    updateSurvey,
  };
}
