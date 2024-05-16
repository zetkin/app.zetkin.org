import { loadListIfNecessary } from 'core/caching/cacheUtils';
import useSurveySubmission from './useSurveySubmission';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyElement,
  ZetkinSurveyExtended,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import { elementsLoad, elementsLoaded } from '../store';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';
import { useApiClient, useAppDispatch, useAppSelector } from 'core/hooks';

type HydratedQuestionBase = {
  description: string | null;
  hidden: boolean;
  question: string;
};

export enum ELEM_TYPE {
  OPEN_QUESTION = 'openQuestion',
  OPTIONS = 'options',
  TEXT_BLOCK = 'textBlock',
}

type HydratedQuestionWithText = HydratedQuestionBase & {
  id: number;
  response: string;
  type: ELEM_TYPE.OPEN_QUESTION;
};

type HydratedQuestionWithOptions = HydratedQuestionBase & {
  id: number;
  selectedOptions: {
    id: number;
    text: string;
  }[];
  type: ELEM_TYPE.OPTIONS;
};

type HydratedTextBlock = {
  header: string;
  id: number;
  text: string;
  type: ELEM_TYPE.TEXT_BLOCK;
};

type HydratedElement =
  | HydratedTextBlock
  | HydratedQuestionWithOptions
  | HydratedQuestionWithText;

export interface HydratedSurveySubmission {
  id: number;
  respondent: ZetkinSurveySubmission['respondent'];
  organization: ZetkinSurveySubmission['organization'];
  elements: HydratedElement[];
  survey: ZetkinSurveySubmission['survey'];
  submitted: string;
}

export default function useHydratedSurveySubmission(
  orgId: number,
  surveyId: number,
  submissionId: number
): IFuture<HydratedSurveySubmission> {
  const dispatch = useAppDispatch();
  const apiClient = useApiClient();
  const submissionFuture = useSurveySubmission(orgId, surveyId, submissionId);
  const surveysSlice = useAppSelector((state) => state.surveys);

  if (!submissionFuture.data) {
    return new LoadingFuture();
  }

  const submission = submissionFuture.data;
  const elementsList = surveysSlice.elementsBySurveyId[surveyId];

  const surveyElementsFuture = loadListIfNecessary<
    ZetkinSurveyElement,
    number,
    [number, ZetkinSurveyElement[]]
  >(elementsList, dispatch, {
    actionOnLoad: () => elementsLoad(surveyId),
    actionOnSuccess: (elements) => elementsLoaded([surveyId, elements]),
    loader: async () => {
      const survey = await apiClient.get<ZetkinSurveyExtended>(
        `/api/orgs/${orgId}/surveys/${surveyId}`
      );
      return survey.elements;
    },
  });

  if (!surveyElementsFuture.data) {
    return new LoadingFuture();
  }

  const surveyElements = surveyElementsFuture.data;
  const elements: HydratedElement[] = [];

  surveyElements.forEach((elem) => {
    if (elem.type == ELEMENT_TYPE.TEXT) {
      elements.push({
        header: elem.text_block.header,
        id: elem.id,
        text: elem.text_block.content,
        type: ELEM_TYPE.TEXT_BLOCK,
      });
    } else {
      const question = elem.question;
      const response = submission.responses?.find(
        (res) => res.question_id == elem.id
      );
      if (!response) {
        return;
      }

      if (
        question.response_type == RESPONSE_TYPE.TEXT &&
        'response' in response
      ) {
        elements.push({
          description: question.description,
          hidden: elem.hidden,
          id: elem.id,
          question: question.question,
          response: response.response,
          type: ELEM_TYPE.OPEN_QUESTION,
        });
      } else if (
        question.response_type == RESPONSE_TYPE.OPTIONS &&
        'options' in response
      ) {
        const hydratedResponse: HydratedQuestionWithOptions = {
          description: elem.question.description,
          hidden: elem.hidden,
          id: elem.id,
          question: elem.question.question,
          selectedOptions: [],
          type: ELEM_TYPE.OPTIONS,
        };

        response.options.forEach((optionId) => {
          const option = question.options?.find(
            (option) => option.id == optionId
          );
          if (option) {
            hydratedResponse.selectedOptions.push({
              id: optionId,
              text: option.text,
            });
          }
        });

        elements.push(hydratedResponse);
      }
    }
  });

  return new ResolvedFuture({
    elements,
    id: submission.id,
    organization: submission.organization,
    respondent: submission.respondent,
    submitted: submission.submitted,
    survey: submission.survey,
  });
}
