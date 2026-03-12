import React, { useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';

import { ZetkinSurveyQuestionElement } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import {
  Zetkin2TextAnswerListPerQuestion,
  Zetkin2TextQuestionStats,
} from 'features/surveys/types';
import {
  CHART_HEIGHT,
  InsightsCard,
  UseChartProExportPublicApi,
} from './InsightsCard';
import { TextWordCloudPlot } from 'features/surveys/components/SurveyInsights/TextWordCloudPlot';
import { QuestionStatsBarPlot } from 'features/surveys/components/SurveyInsights/QuestionStatsBarPlot';
import { TextResponseList } from 'features/surveys/components/SurveyInsights/TextResponseList';

export const TextStatsCard = ({
  question,
  questionStats,
  responseStats,
}: {
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2TextQuestionStats;
  responseStats: Zetkin2TextAnswerListPerQuestion;
}) => {
  const [tab, setTab] = useState('word-cloud');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.textFields.subheader({
        answerCount: questionStats.answer_count,
        totalUniqueWordCount: questionStats.total_unique_word_count,
        totalWordCount: questionStats.total_word_count,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionStats, messages.insights.textFields.subheader]
  );

  const exportApi = useRef<UseChartProExportPublicApi>();

  return (
    <InsightsCard
      exportApi={exportApi}
      exportDisabled={tab === 'responses'}
      onTabChange={(selected) => setTab(selected)}
      question={question}
      subheader={subheader}
      tabOptions={[
        {
          label: messages.insights.textFields.tabs.wordCloud(),
          value: 'word-cloud',
        },
        {
          label: messages.insights.textFields.tabs.wordFrequencies(),
          value: 'word-frequency-bars',
        },
        {
          label: messages.insights.textFields.tabs.responses(),
          value: 'responses',
        },
      ]}
      tabValue={tab}
    >
      <Box height={CHART_HEIGHT} width={'100%'}>
        {tab === 'word-cloud' && (
          <TextWordCloudPlot
            exportApi={exportApi}
            questionStats={questionStats}
          />
        )}
        {tab === 'word-frequency-bars' && (
          <QuestionStatsBarPlot
            displayMode="absolute"
            exportApi={exportApi}
            question={question}
            questionStats={questionStats}
          />
        )}
        {tab === 'responses' && (
          <TextResponseList
            questionStats={questionStats}
            responseStats={responseStats}
          />
        )}
      </Box>
    </InsightsCard>
  );
};
