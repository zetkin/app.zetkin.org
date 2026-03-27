import React, { useMemo, useRef, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { ZetkinSurveyQuestionElement } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import {
  InsightsPlotDisplayMode,
  Zetkin2OptionsQuestionStats,
} from 'features/surveys/types';
import { InsightsCard, UseChartProExportPublicApi } from './InsightsCard';
import { QuestionStatsBarPlot } from 'features/surveys/components/SurveyInsights/QuestionStatsBarPlot';
import { QuestionStatsPiePlot } from 'features/surveys/components/SurveyInsights/QuestionStatsPiePlot';
import Msg from 'core/i18n/Msg';

export const OptionsStatsCard = ({
  question,
  questionStats,
}: {
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2OptionsQuestionStats;
}) => {
  const [tab, setTab] = useState('bar-plot');
  const [displayMode, setDisplayMode] =
    useState<InsightsPlotDisplayMode>('percent');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.optionsFields.subheader({
        answerCount: questionStats.answer_count,
        totalSelectedOptionsCount: questionStats.total_selected_options_count,
      }),
    [
      messages.insights.optionsFields,
      questionStats.answer_count,
      questionStats.total_selected_options_count,
    ]
  );

  const exportApi = useRef<UseChartProExportPublicApi>();
  const displayToggle = (
    <ToggleButtonGroup
      exclusive
      onChange={(_, newValue) => newValue && setDisplayMode(newValue)}
      orientation={'horizontal'}
      size={'small'}
      value={displayMode}
    >
      <ToggleButton size={'small'} value={'absolute'}>
        <Msg
          id={messageIds.insights.optionsFields.displayInsights.absoluteCount}
        />
      </ToggleButton>
      <ToggleButton size={'small'} value={'percent'}>
        <Msg
          id={messageIds.insights.optionsFields.displayInsights.percentCount}
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <InsightsCard
      controls={displayToggle}
      exportApi={exportApi}
      exportDisabled={false}
      onTabChange={(selected) => setTab(selected)}
      question={question}
      subheader={subheader}
      tabOptions={[
        {
          label: messages.insights.optionsFields.tabs.barPlot(),
          value: 'bar-plot',
        },
        {
          label: messages.insights.optionsFields.tabs.piePlot(),
          value: 'pie-chart',
        },
      ]}
      tabValue={tab}
    >
      {tab === 'bar-plot' && (
        <QuestionStatsBarPlot
          displayMode={displayMode}
          exportApi={exportApi}
          question={question}
          questionStats={questionStats}
        />
      )}
      {tab === 'pie-chart' && (
        <QuestionStatsPiePlot
          displayMode={displayMode}
          exportApi={exportApi}
          question={question}
          questionStats={questionStats}
        />
      )}
    </InsightsCard>
  );
};
