import React, { useMemo, useRef, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { DisplayMode, OptionsQuestionStats } from 'features/surveys/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import {
  InsightsCard,
  UseChartProExportPublicApi,
} from 'features/surveys/components/SurveyInsights/InsightsCard';
import { QuestionStatsBarPlot } from 'features/surveys/components/SurveyInsights/QuestionStatsBarPlot';
import { QuestionStatsPie } from 'features/surveys/components/SurveyInsights/QuestionStatsPie';

export const OptionsStatsCard = ({
  questionStats,
}: {
  questionStats: OptionsQuestionStats;
}) => {
  const [tab, setTab] = useState('bar-plot');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percent');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.optionsFields.subheader({
        answerCount: questionStats.answerCount,
        totalSelectedOptionsCount: questionStats.totalSelectedOptionsCount,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionStats, messages.insights.optionsFields.subheader]
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
      questionStats={questionStats}
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
          questionStats={questionStats}
        />
      )}
      {tab === 'pie-chart' && (
        <QuestionStatsPie
          displayMode={displayMode}
          exportApi={exportApi}
          questionStats={questionStats}
        />
      )}
    </InsightsCard>
  );
};
