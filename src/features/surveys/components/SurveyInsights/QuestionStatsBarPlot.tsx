import React, { MutableRefObject, RefObject, useMemo } from 'react';
import { useTheme } from '@mui/material';
import {
  BarChartPro,
  BarChartProPluginSignatures,
} from '@mui/x-charts-pro/BarChartPro';
import { ChartPublicAPI } from '@mui/x-charts/internals/plugins/models';

import {
  DisplayMode,
  isOptionsStats,
  isTextStats,
  QuestionStats,
} from 'features/surveys/types';
import {
  CHART_HEIGHT,
  ChartWrapper,
  COLORS,
  UseChartProExportPublicApi,
} from '../ResponseStatsCards';

export const QuestionStatsBarPlot = ({
  displayMode,
  exportApi,
  questionStats,
}: {
  displayMode: DisplayMode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  questionStats: QuestionStats;
}) => {
  const theme = useTheme();
  const isOptions = isOptionsStats(questionStats);
  const percentBase = isOptions
    ? questionStats.totalSelectedOptionsCount || questionStats.answerCount
    : 0;
  const percentFormatter = (value: number | null) =>
    value == null ? '' : `${value}%`;
  const absoluteFormatter = (value: number | null) =>
    value == null ? '' : value.toString();
  const showPercent = isOptions && displayMode === 'percent';
  const valueFormatter = showPercent ? percentFormatter : absoluteFormatter;

  const data = useMemo(() => {
    const bars = isOptionsStats(questionStats)
      ? questionStats.options.map((o) => {
          let count = o.count;

          if (showPercent) {
            if (percentBase) {
              count = Math.round((o.count / percentBase) * 100);
            } else {
              count = 0;
            }
          }

          return {
            count,
            option: o.option.text,
          };
        })
      : Object.entries(questionStats.topWordFrequencies).map(
          ([word, count]) => ({
            count: count,
            option: word,
          })
        );
    let sorted = bars.sort((a, b) => b.count - a.count);
    if (isTextStats(questionStats)) {
      sorted = sorted.slice(0, 10);
    }
    return sorted;
  }, [questionStats, showPercent, percentBase]);

  return (
    <ChartWrapper>
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
