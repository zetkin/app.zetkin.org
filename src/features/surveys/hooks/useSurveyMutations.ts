import { elementAdded } from '../store';
import {
  ELEMENT_TYPE,
  ZetkinOptionsQuestion,
  ZetkinSurveyElement,
  ZetkinSurveyTextElement,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';
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

type UseSurveyEditingReturn = {
  addElement: (data: ZetkinSurveyElementPostBody) => Promise<void>;
};

export default function useSurveyMutations(
  orgId: number,
  surveyId: number
): UseSurveyEditingReturn {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();

  return {
    async addElement(data) {
      apiClient
        .post<ZetkinSurveyElement, ZetkinSurveyElementPostBody>(
          `/api/orgs/${orgId}/surveys/${surveyId}/elements`,
          data
        )
        .then((newElement) => {
          dispatch(elementAdded([surveyId, newElement]));
          return newElement;
        });
    },
  };
}
