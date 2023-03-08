import Environment from 'core/env/Environment';
import { ModelBase } from 'core/models';
import SurveysRepo from '../repos/SurveysRepo';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import { IFuture, LoadingFuture, ResolvedFuture } from 'core/caching/futures';

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
  response: string;
  type: ELEM_TYPE.OPEN_QUESTION;
};

type HydratedQuestionWithOptions = HydratedQuestionBase & {
  selectedOptions: {
    id: number;
    text: string;
  }[];
  type: ELEM_TYPE.OPTIONS;
};

type HydratedTextBlock = {
  header: string;
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

export default class SurveySubmissionModel extends ModelBase {
  private _orgId: number;
  private _repo: SurveysRepo;
  private _subId: number;

  constructor(env: Environment, orgId: number, subId: number) {
    super();
    this._orgId = orgId;
    this._repo = new SurveysRepo(env);
    this._subId = subId;
  }

  getHydrated(): IFuture<HydratedSurveySubmission> {
    const submissionFuture = this._repo.getSubmission(this._orgId, this._subId);
    if (!submissionFuture.data) {
      return new LoadingFuture();
    }

    const submission = submissionFuture.data;
    const surveyFuture = this._repo.getSurvey(
      this._orgId,
      submission.survey.id
    );

    if (!surveyFuture.data) {
      return new LoadingFuture();
    }

    const survey = surveyFuture.data;
    const elements: HydratedElement[] = [];

    survey.elements.forEach((elem) => {
      if (elem.type == ELEMENT_TYPE.TEXT) {
        elements.push({
          header: elem.text_block.header,
          text: elem.text_block.content,
          type: ELEM_TYPE.TEXT_BLOCK,
        });
      } else {
        const question = elem.question;
        const response = submission.responses.find(
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

  setRespondentId(id: number | null) {
    this._repo.updateSurveySubmission(this._orgId, this._subId, {
      respondent_id: id,
    });
  }
}
