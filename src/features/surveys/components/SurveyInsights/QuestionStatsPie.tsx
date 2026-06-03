import React, { MutableRefObject, useMemo, useState } from 'react';
import { Alert, Collapse, IconButton } from '@mui/material';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import CloseIcon from '@mui/icons-material/Close';

import {
  DisplayMode,
  isOptionsStats,
  QuestionStats,
} from 'features/surveys/types';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import { getEllipsedString } from 'utils/stringUtils';
import {
  CHART_HEIGHT,
  ChartWrapper,
  COLORS,
  UseChartProExportPublicApi,
} from '../ResponseStatsCards';

export const QuestionStatsPie = ({
  displayMode,
  exportApi,
  questionStats,
}: {
  displayMode: DisplayMode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  questionStats: QuestionStats;
}) => {
  const isOptions = isOptionsStats(questionStats);
  const percentBase = isOptions
    ? questionStats.totalSelectedOptionsCount || questionStats.answerCount
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
  const data = useMemo(() => {
    const items = isOptionsStats(questionStats)
      ? questionStats.options.map((o) => {
          let value = o.count;

          if (showPercent) {
            if (percentBase) {
              value = Math.round((o.count / percentBase) * 100);
            } else {
              value = 0;
            }
          }

          return {
            label: getEllipsedString(o.option.text, 60),
            value,
          };
        })
      : Object.entries(questionStats.topWordFrequencies).map(
          ([word, count]) => ({
            label: getEllipsedString(word, 60),
            value: count,
          })
        );
    return items
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ value, label }, index) => ({
        color: COLORS[index % COLORS.length],
        label,
        value,
      }));
  }, [questionStats, showPercent, percentBase]);
  const messages = useMessages(messageIds);
  const [hasSeenPieInaccuracyWarning, setHasSeenPieInaccuracyWarning] =
    useState(false);

  return (
    <>
      {isOptionsStats(questionStats) &&
        !!questionStats.multipleSelectedOptionsCount && (
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
                  respondentCount: questionStats.multipleSelectedOptionsCount,
                }
              )}
            </Alert>
          </Collapse>
        )}
      <ChartWrapper>
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
