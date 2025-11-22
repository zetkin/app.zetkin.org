import { z } from 'zod';

import IApiClient from 'core/api/client/IApiClient';
import { makeRPCDef } from 'core/rpc/types';
import {
  ELEMENT_TYPE,
  RESPONSE_TYPE,
  ZetkinSurveyExtended,
  ZetkinSurveyOption,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveySubmission,
  ZetkinSurveyTextElement,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';

const paramsSchema = z.object({
  orgId: z.number(),
  surveyId: z.number(),
});

type Params = z.input<typeof paramsSchema>;

export type OptionsQuestionStats = {
  answerCount: number;
  options: {
    count: number;
    option: ZetkinSurveyOption;
  }[];
  question: ZetkinSurveyOptionsQuestionElement;
};

export type TextQuestionStats = {
  answerCount: number;
  question: ZetkinSurveyTextQuestionElement;
};

export type QuestionStats = OptionsQuestionStats | TextQuestionStats;

export type SurveyResponseStats = {
  id: number;
  questions: QuestionStats[];
};

export const getSurveyResponseStatsDef = {
  handler: handle,
  name: 'getSurveyResponseStats',
  schema: paramsSchema,
};

export default makeRPCDef<Params, SurveyResponseStats>(
  getSurveyResponseStatsDef.name
);

async function handle(
  params: Params,
  apiClient: IApiClient
): Promise<SurveyResponseStats> {
  const { orgId, surveyId } = params;

  const [survey, submissions]: [
    ZetkinSurveyExtended,
    ZetkinSurveySubmission[]
  ] = await Promise.all([
    apiClient.get<ZetkinSurveyExtended>(
      `/api/orgs/${orgId}/surveys/${surveyId}`
    ),
    apiClient.get<ZetkinSurveySubmission[]>(
      `/api/orgs/${orgId}/surveys/${surveyId}/submissions`
    ),
  ]);

  const responses: (ZetkinSurveySubmission | undefined)[] = await Promise.all(
    submissions.map((submission) =>
      apiClient
        .get<ZetkinSurveySubmission>(
          `/api/orgs/${orgId}/survey_submissions/${submission.id}`
        )
        .catch(() => Promise.resolve(undefined))
    )
  );

  const selectedOptions: Record<
    number,
    Record<
      number,
      {
        count: 0;
        option: ZetkinSurveyOption;
      }
    >
  > = {};
  const answerCounter: Record<number, number> = {};

  survey.elements.forEach((question) => {
    if (question.type === ELEMENT_TYPE.TEXT) {
      return;
    }

    answerCounter[question.id] = 0;

    if (question.question.response_type === RESPONSE_TYPE.TEXT) {
      return;
    }

    selectedOptions[question.id] = {};
    (question as ZetkinSurveyOptionsQuestionElement).question.options.forEach(
      (option) => {
        selectedOptions[question.id][option.id] = {
          count: 0,
          option: option,
        };
      }
    );
  });

  responses.forEach((response) => {
    if (!response || !response.responses) {
      return;
    }

    response.responses.forEach((response) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          answerCounter,
          response.question_id
        )
      ) {
        return;
      }

      answerCounter[response.question_id]++;

      if ('response' in response) {
        return;
      }

      response.options.forEach((option) => {
        selectedOptions[response.question_id][option].count++;
      });
    });
  });

  const questionStats = survey.elements
    .map((question) => {
      if (question.type === ELEMENT_TYPE.TEXT) {
        return null;
      }

      if (question.question.response_type === RESPONSE_TYPE.TEXT) {
        return <TextQuestionStats>{
          answerCount: answerCounter[question.id],
          question: question as ZetkinSurveyTextElement,
        };
      }

      question = question as ZetkinSurveyOptionsQuestionElement;

      return <OptionsQuestionStats>{
        answerCount: answerCounter[question.id],
        options:
          question.question.options?.map(
            (option) => selectedOptions[question.id][option.id]
          ) ?? [],
        question: question,
      };
    })
    .filter((el) => !!el) as QuestionStats[];

  return {
    id: surveyId,
    questions: questionStats,
  };
}
