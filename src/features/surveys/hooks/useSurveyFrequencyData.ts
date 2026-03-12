import { useMemo } from 'react';

import { isTextStats, Zetkin2QuestionStats } from 'features/surveys/types';

export type NLPAnalysisType =
  | 'word-frequency'
  | 'verb-frequency'
  | 'entity-frequency';

export const useFrequencyData = (
  questionStats: Zetkin2QuestionStats,
  analysisType: NLPAnalysisType
): Record<string, number> => {
  return useMemo(() => {
    if (!isTextStats(questionStats)) {
      return {};
    }

    if (analysisType === 'verb-frequency') {
      return questionStats.top_verb_frequencies;
    } else if (analysisType === 'entity-frequency') {
      return questionStats.top_entity_frequencies;
    }
    return questionStats.top_word_frequencies;
  }, [questionStats, analysisType]);
};
