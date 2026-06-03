import React, { useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';

import { SubmissionStats, TextQuestionStats } from 'features/surveys/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import {
  CHART_HEIGHT,
  ResponseStatsCard,
  UseChartProExportPublicApi,
} from 'features/surveys/components/ResponseStatsCards';
import { TextResponseWordCloud } from 'features/surveys/components/SurveyInsights/TextResponseWordCloud';
import { QuestionStatsBarPlot } from 'features/surveys/components/SurveyInsights/QuestionStatsBarPlot';
import { TextResponseList } from 'features/surveys/components/SurveyInsights/TextResponseList';

export const TextStatsCard = ({
  questionStats,
  submissionStats,
}: {
  questionStats: TextQuestionStats;
  submissionStats: SubmissionStats[];
}) => {
  const [tab, setTab] = useState('word-cloud');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.textFields.subheader({
        answerCount: questionStats.answerCount,
        totalUniqueWordCount: questionStats.totalUniqueWordCount,
        totalWordCount: questionStats.totalWordCount,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionStats, messages.insights.textFields.subheader]
  );

  const exportApi = useRef<UseChartProExportPublicApi>();

  return (
    <ResponseStatsCard
      exportApi={exportApi}
      exportDisabled={tab === 'responses'}
      onTabChange={(selected) => setTab(selected)}
      questionStats={questionStats}
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
          <TextResponseWordCloud
            exportApi={exportApi}
            questionStats={questionStats}
          />
        )}
        {tab === 'word-frequency-bars' && (
          <QuestionStatsBarPlot
            displayMode="absolute"
            exportApi={exportApi}
            questionStats={questionStats}
          />
        )}
        {tab === 'responses' && (
          <TextResponseList
            questionStats={questionStats}
            submissionStats={submissionStats}
          />
        )}
      </Box>
    </ResponseStatsCard>
  );
};
