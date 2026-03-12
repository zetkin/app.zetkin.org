import {
  ZetkinOptionsQuestion,
  ZetkinSurveyQuestionResponse,
  ZetkinTextQuestion,
} from 'utils/types/zetkin';

export type Zetkin2OptionsQuestionStats = {
  answer_count: number;
  multiple_selected_options_count: number;
  options: {
    count: number;
    option_id: number;
  }[];
  question_id: number;
  total_selected_options_count: number;
};

export type Zetkin2TextQuestionStats = {
  answer_count: number;
  question_id: number;
  top_entity_frequencies: Record<string, number>;
  top_verb_frequencies: Record<string, number>;
  top_word_frequencies: Record<string, number>;
  total_unique_word_count: number;
  total_word_count: number;
};

export type Zetkin2QuestionStats =
  | Zetkin2OptionsQuestionStats
  | Zetkin2TextQuestionStats;

export type Zetkin2TextAnswerListPerQuestion = Record<string, number[]>;

export type Zetkin2SurveyInsights = {
  id: number;
  questions: Zetkin2QuestionStats[];
  response_stats: Zetkin2TextAnswerListPerQuestion;
};

export const isOptionsStats = (questionStats: Zetkin2QuestionStats) =>
  'options' in questionStats;

export const isTextStats = (questionStats: Zetkin2QuestionStats) =>
  'top_word_frequencies' in questionStats;

export const isTextResponse = (response: ZetkinSurveyQuestionResponse) => {
  return 'response' in response;
};

export const isOptionsResponse = (response: ZetkinSurveyQuestionResponse) => {
  return 'options' in response;
};

export const isOptionsQuestion = (
  question: ZetkinOptionsQuestion | ZetkinTextQuestion
): question is ZetkinOptionsQuestion => {
  return 'options' in question;
};

export const isTextQuestion = (
  question: ZetkinOptionsQuestion | ZetkinTextQuestion
): question is ZetkinTextQuestion => {
  return !('options' in question);
};
