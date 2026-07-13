import {
  ZetkinSurveyOption,
  ZetkinSurveyOptionsQuestionElement,
  ZetkinSurveyQuestionResponse,
  ZetkinSurveyTextQuestionElement,
} from 'utils/types/zetkin';

export type OptionsQuestionStats = {
  answerCount: number;
  multipleSelectedOptionsCount: number;
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

export type ResponseStatsCounter = {
  answerCounter: number;
  multipleSelectedOptionsCount: number;
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

export const isTextResponse = (response: ZetkinSurveyQuestionResponse) => {
  return 'response' in response;
};

export const isOptionsResponse = (response: ZetkinSurveyQuestionResponse) => {
  return 'options' in response;
};

export const isTextStats = (questionStats: QuestionStats) => {
  return 'topWordFrequencies' in questionStats;
};

export const isOptionsStats = (questionStats: QuestionStats) => {
  return 'options' in questionStats;
};

export type DisplayMode = 'absolute' | 'percent';
