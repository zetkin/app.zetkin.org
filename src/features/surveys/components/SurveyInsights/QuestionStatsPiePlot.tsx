import React, { MutableRefObject, useMemo, useState } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import CloseIcon from '@mui/icons-material/Close';

import { ZetkinSurveyQuestionElement } from 'utils/types/zetkin';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import { getEllipsedString } from 'utils/stringUtils';
import {
  InsightsPlotDisplayMode,
  isOptionsQuestion,
  isOptionsStats,
  Zetkin2QuestionStats,
} from 'features/surveys/types';
import {
  CHART_HEIGHT,
  ChartWrapper,
  COLORS,
  UseChartProExportPublicApi,
} from './InsightsCard';
import { useSurveyAnalysisTypeSelection } from 'features/surveys/hooks/useSurveyAnalysisTypeSelection';

export const QuestionStatsPiePlot = ({
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
  const isOptions = isOptionsStats(questionStats);
  const percentBase = isOptions
    ? questionStats.total_selected_options_count || questionStats.answer_count
    : 0;
  const pieArcLabelFormatter = (
    item: { value: number } & Record<string, unknown>
  ) => `${item.value}%`;
  const showPercent = isOptions && displayMode === 'percent';
  const pieValueFormatter = (
    value: number | { value: number } | null
  ): string => {
    if (value == null) {
      return '';
    }

    const numericValue = typeof value === 'number' ? value : value.value;
    return showPercent ? `${numericValue}%` : numericValue.toString();
  };

  const typeSelection = useSurveyAnalysisTypeSelection(questionStats);

  const data = useMemo(() => {
    const items = isOptionsStats(questionStats)
      ? (isOptionsQuestion(question.question)
          ? question.question.options || []
          : []
        ).map((o) => {
          let value =
            questionStats.options.find((c) => c.option_id === o.id)?.count || 0;

          if (showPercent) {
            if (percentBase) {
              value = Math.round((value / percentBase) * 100);
            } else {
              value = 0;
            }
          }

          return {
            label: getEllipsedString(o.text, 60),
            value,
          };
        })
      : Object.entries(typeSelection.freqData).map(([word, count]) => ({
          label: getEllipsedString(word, 60),
          value: count,
        }));
    return items
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ value, label }, index) => ({
        color: COLORS[index % COLORS.length],
        label,
        value,
      }));
  }, [
    questionStats,
    question.question,
    typeSelection.freqData,
    showPercent,
    percentBase,
  ]);
  const messages = useMessages(messageIds);
  const [hasSeenPieInaccuracyWarning, setHasSeenPieInaccuracyWarning] =
    useState(false);

  return (
    <>
      {isOptionsStats(questionStats) &&
        !!questionStats.multiple_selected_options_count && (
          <Collapse in={!hasSeenPieInaccuracyWarning}>
            <Alert
              action={
                <IconButton
                  onClick={() => setHasSeenPieInaccuracyWarning(true)}
                  size={'small'}
                >
                  <CloseIcon fontSize={'inherit'} />
                </IconButton>
              }
              severity={'warning'}
            >
              {messages.insights.optionsFields.warningMultipleSelectedOptionsPie(
                {
                  respondentCount:
                    questionStats.multiple_selected_options_count,
                }
              )}
            </Alert>
          </Collapse>
        )}
      <ChartWrapper typeSelection={typeSelection}>
        <PieChartPro
          apiRef={
            exportApi as unknown as MutableRefObject<UseChartProExportPublicApi>
          }
          height={CHART_HEIGHT}
          series={[
            {
              arcLabel: showPercent ? pieArcLabelFormatter : 'value',
              cornerRadius: 5,
              data,
              innerRadius: 80,
              outerRadius: 180,
              valueFormatter: pieValueFormatter,
            },
          ]}
          slotProps={{
            pieArc: {
              strokeWidth: 3,
            },
            pieArcLabel: {
              fill: 'white',
            },
          }}
          sx={{
            '.MuiPieArcLabel-root': {
              fill: 'white !important',
            },
            gap: '20px',
          }}
          width={360}
        />
      </ChartWrapper>
    </>
  );
};
