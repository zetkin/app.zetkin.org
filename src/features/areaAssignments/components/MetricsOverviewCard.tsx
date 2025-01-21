import React, { FC } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import { lighten } from '@mui/system';

import messageIds from 'features/areaAssignments/l10n/messageIds';
import { Msg } from 'core/i18n';
import theme from 'theme';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';
import { ZetkinAreaAssignmentStats, ZetkinMetric } from '../types';
import ZUIResponsiveContainer from 'zui/ZUIResponsiveContainer';

type BooleanMetricProps = {
  metric: ZetkinMetric;
  stats: ZetkinAreaAssignmentStats;
};

export const BooleanMetric: FC<BooleanMetricProps> = ({ metric, stats }) => (
  <Box m={2}>
    <Box
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      my={1}
    >
      <Typography mb={1}>{metric.question}</Typography>
    </Box>
    <ZUIStackedStatusBar
      values={[
        {
          color: theme.palette.primary.main,
          value: stats.num_visited_households,
        },
        {
          color: lighten(theme.palette.primary.main, 0.6),
          value: stats.num_households - stats.num_visited_households,
        },
      ]}
    />
    <Box alignItems="center" display="flex" justifyContent="flex-start" mt={1}>
      <Box alignItems="center" display="flex">
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: '50%',
            height: 10,
            mr: 1,
            width: 10,
          }}
        />
        <Typography mr={1} variant="body2">
          Yes:
        </Typography>
        <Typography mr={2} variant="body2">
          35%
        </Typography>

        <Box
          sx={{
            backgroundColor: lighten(theme.palette.primary.main, 0.6),
            borderRadius: '50%',
            height: 10,
            mr: 1,
            width: 10,
          }}
        />
        <Typography mr={1} variant="body2">
          No:
        </Typography>
        <Typography variant="body2">65%</Typography>
      </Box>
    </Box>
  </Box>
);

type ScaleMetricProps = {
  metric: ZetkinMetric;
};

export const ScaleMetric: FC<ScaleMetricProps> = ({ metric }) => {
  const values = [16, 18, 3, 27, 14];
  let ratingTotals = 0;
  let numRatings = 0;
  values.map((val, i) => {
    numRatings += val;
    ratingTotals += val * (i + 1);
  });
  const avg = ratingTotals / numRatings;

  return (
    <Box m={2}>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Typography mb={1}>{metric.question}</Typography>
      </Box>
      <ZUIResponsiveContainer ssrWidth={200}>
        {(width) => {
          const svgHeight = 50;

          const highestValue = Math.max(...values);

          let path = `M 0 ${svgHeight}`;
          path =
            path +
            values
              .map((val, i) => {
                const x = i * (width / 4);
                const y = svgHeight - (val / highestValue) * svgHeight;
                const prevX = (i - 1) * (width / 4);
                const prevY =
                  svgHeight - (values[i - 1] / highestValue) * svgHeight;
                if (i === 0) {
                  return `L ${x} ${y}`;
                } else {
                  return `C ${prevX + width / 12} ${prevY}, ${
                    x - width / 12
                  } ${y}, ${x} ${y}`;
                }
              })
              .join(' ');
          path = path + ` L ${width} ${svgHeight} Z`;

          return (
            <svg
              height="50"
              version="1.1"
              width={width}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={path} fill={lighten(theme.palette.primary.main, 0.6)} />
            </svg>
          );
        }}
      </ZUIResponsiveContainer>
      <ZUIStackedStatusBar
        height={8}
        values={[
          { color: theme.palette.primary.main, value: avg },
          { color: theme.palette.primary.main, value: 5 - avg },
        ]}
      />
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Box display="flex">
          {[1, 2, 3, 4, 5].map((value, index) => (
            <>
              <Typography color="secondary">{`${value}:`}</Typography>
              <Typography mr={2}>{`${values[index]} `}</Typography>
            </>
          ))}
        </Box>
        <Box>Average: {avg.toFixed(2)}</Box>
      </Box>
    </Box>
  );
};

type MetricsOverviewCardProps = {
  metrics: ZetkinMetric[];
  stats: ZetkinAreaAssignmentStats;
};

export const MetricsOverviewCard: FC<MetricsOverviewCardProps> = ({
  metrics,
  stats,
}) => {
  return (
    <Card>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-start"
        mx={2}
        py={2}
      >
        <Typography mr={1} variant="h5">
          <Msg id={messageIds.overview.metrics.title} />
        </Typography>
        <Divider flexItem orientation="vertical" />
        <Typography color={theme.palette.primary.main} ml={1}>
          {stats.num_visited_households}
        </Typography>
      </Box>
      <Divider />

      {metrics.map((metric) => {
        if (metric.kind === 'boolean') {
          return (
            <BooleanMetric key={metric.id} metric={metric} stats={stats} />
          );
        } else if (metric.kind === 'scale5') {
          return <ScaleMetric key={metric.id} metric={metric} />;
        } else {
          return null;
        }
      })}
    </Card>
  );
};
