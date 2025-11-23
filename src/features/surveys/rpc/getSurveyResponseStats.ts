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
  totalSelectedOptionsCount: number;
};

export type TextQuestionStats = {
  answerCount: number;
  question: ZetkinSurveyTextQuestionElement;
  topWordFrequencies: Record<string, number>;
  totalUniqueWordCount: number;
  totalWordCount: number;
};

export type QuestionStats = OptionsQuestionStats | TextQuestionStats;

export type SubmissionStats = {
  answeredTextQuestions: number[];
  submissionId: number;
};

export type SurveyResponseStats = {
  id: number;
  questions: QuestionStats[];
  submissionStats: SubmissionStats[];
};

export const getSurveyResponseStatsDef = {
  handler: handle,
  name: 'getSurveyResponseStats',
  schema: paramsSchema,
};

type ResponseStatsCounter = {
  answerCounter: number;
  selectedOptions: Record<
    number,
    {
      count: 0;
      option: ZetkinSurveyOption;
    }
  >;
  topWordFrequencies: Record<string, number>;
  totalSelectedOptionsCounts: number;
  totalUniqueWordCount: number;
  totalWordCounts: number;
  wordFrequencies: Record<string, number>;
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

  const responseStatsCounters: Record<number, ResponseStatsCounter> = {};

  survey.elements.forEach((question) => {
    if (question.type === ELEMENT_TYPE.TEXT) {
      return;
    }

    // initialize counters for each question
    responseStatsCounters[question.id] = {
      answerCounter: 0,
      selectedOptions: {},
      topWordFrequencies: {},
      totalSelectedOptionsCounts: 0,
      totalUniqueWordCount: 0,
      totalWordCounts: 0,
      wordFrequencies: {},
    };
    // handle questions with options as response
    if (
      question.question.response_type === RESPONSE_TYPE.TEXT ||
      !question.question.options
    ) {
      return;
    }
    (question as ZetkinSurveyOptionsQuestionElement).question.options!.forEach(
      (option) => {
        responseStatsCounters[question.id].selectedOptions[option.id] = {
          count: 0,
          option: option,
        };
      }
    );
  });

  // this handles questions with text as response
  responses.forEach((response) => {
    if (!response || !response.responses) {
      return;
    }

    response.responses.forEach((response) => {
      if (
        !Object.prototype.hasOwnProperty.call(
          responseStatsCounters,
          response.question_id
        )
      ) {
        return;
      }

      if (!('response' in response) || response.response.length > 0) {
        responseStatsCounters[response.question_id].answerCounter++;
      }

      if ('response' in response) {
        const wordList = response.response
          .toLowerCase()
          .replace(/[^a-z0-9]+/gi, ' ')
          .split(/\s+/)
          .filter(Boolean);
        responseStatsCounters[response.question_id].totalWordCounts +=
          wordList.length;

        const wordSet = new Set(wordList);

        for (const w of wordSet) {
          responseStatsCounters[response.question_id].wordFrequencies[w] =
            (responseStatsCounters[response.question_id].wordFrequencies[w] ??
              0) + 1;
        }

        return;
      }

      responseStatsCounters[response.question_id].totalSelectedOptionsCounts +=
        response.options.length;
      response.options.forEach((option) => {
        responseStatsCounters[response.question_id].selectedOptions[option]
          .count++;
      });
    });
  });

  for (const questionId in responseStatsCounters) {
    const wordFrequenciesAsList = Object.entries(
      responseStatsCounters[questionId].wordFrequencies
    );
    responseStatsCounters[questionId].topWordFrequencies = Object.fromEntries(
      wordFrequenciesAsList.sort((a, b) => b[1] - a[1]).slice(0, 100)
    );
    responseStatsCounters[questionId].totalUniqueWordCount =
      wordFrequenciesAsList.length;
  }

  const questionStats = survey.elements
    .map((question) => {
      if (question.type === ELEMENT_TYPE.TEXT) {
        return null;
      }

      const counter = responseStatsCounters[question.id];

      if (question.question.response_type === RESPONSE_TYPE.TEXT) {
        return <TextQuestionStats>{
          answerCount: counter.answerCounter,
          question: question as ZetkinSurveyTextElement,
          topWordFrequencies: counter.topWordFrequencies,
          totalUniqueWordCount: counter.totalUniqueWordCount,
          totalWordCount: counter.totalWordCounts,
        };
      }

      question = question as ZetkinSurveyOptionsQuestionElement;

      return <OptionsQuestionStats>{
        answerCount: counter.answerCounter,
        options:
          question.question.options?.map(
            (option) => counter.selectedOptions[option.id]
          ) ?? [],
        question: question,
        totalSelectedOptionsCount: counter.totalSelectedOptionsCounts,
      };
    })
    .filter((el) => !!el) as QuestionStats[];

  const submissionStats: SubmissionStats[] = responses
    .filter((resp) => !!resp)
    .map((response) => {
      return <SubmissionStats>{
        answeredTextQuestions: response!.responses
          ? response!.responses
              .filter((resp) => 'response' in resp && !!resp.response)
              .map((resp) => resp.question_id)
          : [],
        submissionId: response!.id,
      };
    });

  return {
    id: surveyId,
    questions: questionStats,
    submissionStats: submissionStats,
  };
}
