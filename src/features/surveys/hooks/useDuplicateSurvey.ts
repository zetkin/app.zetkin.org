import { useApiClient, useAppDispatch } from 'core/hooks';
import {
  ZetkinSurveyExtended,
  ZetkinSurvey,
  ZetkinSurveyPostBody,
  ZetkinSurveyElement,
  ELEMENT_TYPE,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';
import { surveyCreate, surveyCreated, elementAdded } from '../store';
import { ZetkinSurveyElementPostBody } from './useSurveyMutations';

export default function useDuplicateSurvey(
  orgId: number,
  surveyId: number,
  campId: number
) {
  const apiClient = useApiClient();
  const dispatch = useAppDispatch();
  const createPostBody = (
    element: ZetkinSurveyElement
  ): ZetkinSurveyElementPostBody | null => {
    if (element.type === ELEMENT_TYPE.TEXT) {
      return {
        hidden: element.hidden,
        text_block: element.text_block,
        type: element.type,
      };
    }

    if (element.type === ELEMENT_TYPE.QUESTION) {
      if ('options' in element.question) {
        return {
          hidden: element.hidden,
          question: {
            description: element.question.description,
            options: element.question.options?.map((option) => option.text),
            question: element.question.question,
            response_config: element.question.response_config,
            response_type: element.question.response_type,
          },
          type: element.type,
        };
      }
      element = element as ZetkinSurveyTextQuestionElement;
      return {
        hidden: element.hidden,
        question: {
          description: element.question.description,
          question: element.question.question,
          response_config: element.question.response_config,
          response_type: element.question.response_type,
        },
        type: element.type,
      };
    }
    return null;
  };

  return async (): Promise<boolean> => {
    const survey = await apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    );
    if (!survey) {
      return false;
    }

    dispatch(surveyCreate());

    const body: ZetkinSurveyPostBody = {
      access: survey?.access,
      callers_only: survey?.callers_only,
      expires: survey?.expires,
      info_text: survey?.info_text,
      org_access: survey?.org_access,
      published: survey?.published,
      signature: survey?.signature,
      title: survey?.title || '',
    };

    const newSurvey = await apiClient.post<ZetkinSurvey, ZetkinSurveyPostBody>(
      `/api/orgs/${orgId}/campaigns/${campId}/surveys`,
      body
    );
    dispatch(surveyCreated(newSurvey as ZetkinSurveyExtended));

    for (const element of survey.elements) {
      const postBody = createPostBody(element);
      if (postBody) {
        const createdElement = await apiClient.post<
          ZetkinSurveyElement,
          ZetkinSurveyElementPostBody
        >(`/api/orgs/${orgId}/surveys/${newSurvey.id}/elements`, postBody);
        dispatch(elementAdded([newSurvey.id, createdElement]));
      }
    }
    return true;
  };
}
