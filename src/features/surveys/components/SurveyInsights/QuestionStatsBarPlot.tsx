import React, { MutableRefObject, RefObject, useMemo } from 'react';
import { useTheme } from '@mui/material';
import {
  BarChartPro,
  BarChartProPluginSignatures,
} from '@mui/x-charts-pro/BarChartPro';
import { ChartPublicAPI } from '@mui/x-charts/internals/plugins/models';

import { ZetkinSurveyQuestionElement } from 'utils/types/zetkin';
import {
  InsightsPlotDisplayMode,
  isOptionsQuestion,
  isOptionsStats,
  isTextStats,
  Zetkin2QuestionStats,
} from 'features/surveys/types';
import { useSurveyAnalysisTypeSelection } from 'features/surveys/hooks/useSurveyAnalysisTypeSelection';
import {
  CHART_HEIGHT,
  ChartWrapper,
  COLORS,
  UseChartProExportPublicApi,
} from './InsightsCard';

export const QuestionStatsBarPlot = ({
  displayMode,
  exportApi,
  question,
  questionStats,
}: {
  displayMode: InsightsPlotDisplayMode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2QuestionStats;
}) => {
  const typeSelection = useSurveyAnalysisTypeSelection(questionStats);

  const theme = useTheme();
  const isOptions = isOptionsStats(questionStats);
  const percentBase = isOptions
    ? questionStats.total_selected_options_count || questionStats.answer_count
    : 0;
  const percentFormatter = (value: number | null) =>
    value == null ? '' : `${value}%`;
  const absoluteFormatter = (value: number | null) =>
    value == null ? '' : value.toString();
  const showPercent = isOptions && displayMode === 'percent';
  const valueFormatter = showPercent ? percentFormatter : absoluteFormatter;

  const data = useMemo(() => {
    const bars = isOptionsStats(questionStats)
      ? (isOptionsQuestion(question.question)
          ? question.question.options || []
          : []
        ).map((o) => {
          let count =
            questionStats.options.find((c) => c.option_id === o.id)?.count || 0;

          if (showPercent) {
            if (percentBase) {
              count = Math.round((count / percentBase) * 100);
            } else {
              count = 0;
            }
          }

          return {
            count,
            option: o.text,
          };
        })
      : Object.entries(typeSelection.freqData).map(([word, count]) => ({
          count: count,
          option: word,
        }));
    let sorted = bars.sort((a, b) => b.count - a.count);
    if (isTextStats(questionStats)) {
      sorted = sorted.slice(0, 10);
    }
    return sorted;
  }, [
    questionStats,
    question.question,
    typeSelection.freqData,
    showPercent,
    percentBase,
  ]);

  return (
    <ChartWrapper typeSelection={typeSelection}>
      <BarChartPro
        apiRef={
          exportApi as unknown as RefObject<
            ChartPublicAPI<BarChartProPluginSignatures> | undefined
          >
        }
        grid={{
          vertical: true,
        }}
        height={CHART_HEIGHT}
        layout={'horizontal'}
        series={[
          {
            data: data.map((option) => option.count),
            valueFormatter,
          },
        ]}
        slotProps={{
          tooltip: {
            sx: {
              caption: {
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              maxWidth: '60vw',
              overflow: 'hidden',
            },
          },
        }}
        sx={{
          '.MuiChartsAxis-tick': {
            stroke: `${theme.palette.grey['700']} !important`,
          },
          height: CHART_HEIGHT,
        }}
        xAxis={[
          {
            disableLine: true,
            tickLabelStyle: { fill: theme.palette.grey['700'] },
            valueFormatter,
          },
        ]}
        yAxis={[
          {
            colorMap: {
              colors: COLORS,
              type: 'ordinal',
            },
            data: data.map((option) => option.option),
            disableLine: true,
            disableTicks: true,
            id: 'barCategories',
            tickLabelStyle: { fill: theme.palette.common.black },
            width: 200,
          },
        ]}
      />
    </ChartWrapper>
  );
};
