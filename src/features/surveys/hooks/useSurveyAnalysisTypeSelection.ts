import { useMemo, useState } from 'react';

import { isTextStats, Zetkin2QuestionStats } from 'features/surveys/types';

export type NLPAnalysisType =
  | 'word-frequency'
  | 'verb-frequency'
  | 'entity-frequency';

export const useSurveyAnalysisTypeSelection = (
  questionStats: Zetkin2QuestionStats
) => {
  const [analysisType, setAnalysisType] =
    useState<NLPAnalysisType>('word-frequency');

  const [freqData, hasFreqData]: [Record<string, number>, boolean] =
    useMemo(() => {
      if (!isTextStats(questionStats)) {
        return [{}, false];
      }

      if (analysisType === 'verb-frequency') {
        return [questionStats.top_verb_frequencies, true];
      } else if (analysisType === 'entity-frequency') {
        return [questionStats.top_entity_frequencies, true];
      }
      return [questionStats.top_word_frequencies, true];
    }, [questionStats, analysisType]);

  return useMemo(
    () => ({
      analysisType,
      freqData,
      hasFreqData,
      setAnalysisType,
    }),
    [analysisType, setAnalysisType, freqData, hasFreqData]
  );
};
