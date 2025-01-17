import React, { FC } from 'react';
import { Box, Card, Divider, Typography } from '@mui/material';
import { lighten } from '@mui/system';

import messageIds from 'features/areaAssignments/l10n/messageIds';
import { Msg } from 'core/i18n';
import theme from 'theme';
import ZUIStackedStatusBar from 'zui/ZUIStackedStatusBar';
import { ZetkinAreaAssignmentStats, ZetkinMetric } from '../types';

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

export const ScaleMetric: FC<ScaleMetricProps> = ({ metric }) => (
  <Box m={2}>
    <Box display="flex" justifyContent="space-between" mt={1}>
      <Typography mb={1}>{metric.question}</Typography>
    </Box>
    <ZUIStackedStatusBar
      values={[
        { color: theme.palette.primary.main, value: 1 },
        { color: lighten(theme.palette.primary.main, 0.2), value: 18 },
        { color: lighten(theme.palette.primary.main, 0.4), value: 3 },
        { color: lighten(theme.palette.primary.main, 0.6), value: 6 },
        { color: lighten(theme.palette.primary.main, 0.8), value: 6 },
      ]}
    />
    <Box display="flex" justifyContent="space-between" mt={1}>
      <Box display="flex">
        {[1, 2, 3, 4, 5].map((value, index) => (
          <Box key={index} alignItems="center" display="flex" mr={1}>
            <Box
              sx={{
                backgroundColor: lighten(
                  theme.palette.primary.main,
                  index * 0.2
                ),
                borderRadius: '50%',
                height: 10,
                mr: 1,
                width: 10,
              }}
            />
            <Typography>{`${value}: ${[1, 18, 3, 6, 6][index]}%`}</Typography>
          </Box>
        ))}
      </Box>
      <Box>Average: 3.5</Box>
    </Box>
  </Box>
);

type MetricsOverviewCardProps = {
  stats: ZetkinAreaAssignmentStats;
};

export const MetricsOverviewCard: FC<MetricsOverviewCardProps> = ({
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

      {stats.metrics.map((metric) => {
        if (metric.metric.kind === 'boolean') {
          return <BooleanMetric metric={metric.metric} stats={stats} />;
        } else if (metric.metric.kind == 'scale5') {
          return <ScaleMetric metric={metric.metric} />;
        } else {
          return null;
        }
      })}
    </Card>
  );
};
