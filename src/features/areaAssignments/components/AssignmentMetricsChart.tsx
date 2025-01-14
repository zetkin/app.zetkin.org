import { FC } from 'react';
import { Box, lighten, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

import { ZetkinAreaAssignmentStats } from '../types';

type Props = {
  stats: ZetkinAreaAssignmentStats;
};

const AssignmentMetricsChart: FC<Props> = ({ stats }) => {
  const theme = useTheme();

  const metricBars = stats.metrics.map((response) => {
    if (response.metric.kind == 'boolean') {
      return {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        question: response.metric.question,
        yes: response.values[0],
      };
    } else {
      return {
        1: response.values[0],
        2: response.values[1],
        3: response.values[2],
        4: response.values[3],
        5: response.values[4],
        question: response.metric.question,
        yes: 0,
      };
    }
  });

  return (
    <Box sx={{ height: 40 + metricBars.length * 80 }}>
      <ResponsiveBar
        colors={[
          theme.palette.primary.main,
          theme.palette.primary.main,
          lighten(theme.palette.primary.main, 0.15),
          lighten(theme.palette.primary.main, 0.3),
          lighten(theme.palette.primary.main, 0.45),
          lighten(theme.palette.primary.main, 0.6),
          lighten(theme.palette.primary.main, 0.75),
        ]}
        data={metricBars}
        enableGridX={true}
        enableGridY={false}
        enableLabel={false}
        gridYValues={[]}
        indexBy="question"
        keys={['yes', '1', '2', '3', '4', '5']}
        layout="horizontal"
        margin={{
          bottom: 40,
          left: 120,
          right: 20,
          top: 10,
        }}
        padding={0.5}
      />
    </Box>
  );
};

export default AssignmentMetricsChart;
