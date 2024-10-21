import { ResponsiveBar } from '@nivo/bar';
import { FC } from 'react';
import { Box, Card, Divider, Typography, lighten } from '@mui/material';

import theme from 'theme';
import { ZetkinCanvassAssignmentStats } from '../types';
import MetricRadialBar from './MetricRadialBar';

type OutcomesCardProps = {
  stats: ZetkinCanvassAssignmentStats;
};

type MetricBars = {
  count: number;
  question: string;
  rating: number;
};

const OutcomesCard: FC<OutcomesCardProps> = ({ stats }) => {
  const metricBars: MetricBars[] = stats.metrics.flatMap((response) => {
    if (response.metric.kind === 'scale5') {
      return response.values.map((value, index) => ({
        count: value,
        question: response.metric.question,
        rating: index + 1,
      }));
    }
    return [];
  });

  return (
    <Card sx={{ padding: '16px' }}>
      <Box display="flex">
        <Typography variant="h4">Outcomes</Typography>
      </Box>
      <Divider sx={{ marginBottom: 2, marginTop: 2 }} />

      {stats.metrics.map((metric) => {
        return metric.metric.kind === 'boolean' ? (
          <>
            <Box mt={2}>
              <Box width="20%">
                <MetricRadialBar
                  mainTotal={metric.values[0] + metric.values[1]}
                  mainValue={metric.values[0]}
                  rawYes={metric.values[0]}
                  title={metric.metric.question}
                />
              </Box>
            </Box>
            <Divider sx={{ margin: 2 }} />
          </>
        ) : (
          <Box>
            <Typography>
              <Typography mb={2}>{metric.metric.question}</Typography>
            </Typography>
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveBar
                animate={true}
                axisBottom={{
                  tickPadding: 5,
                  tickRotation: 0,
                  tickSize: 5,
                }}
                axisLeft={null}
                axisRight={null}
                axisTop={null}
                colors={[
                  lighten(theme.palette.primary.main, 0.15),
                  lighten(theme.palette.primary.main, 0.3),
                  lighten(theme.palette.primary.main, 0.45),
                  lighten(theme.palette.primary.main, 0.6),
                  lighten(theme.palette.primary.main, 0.75),
                ]}
                data={metricBars}
                enableGridX={false}
                enableGridY={false}
                indexBy="rating"
                keys={['count']}
                labelSkipHeight={12}
                labelSkipWidth={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                margin={{ bottom: 40, left: 40, right: 20, top: 20 }}
                padding={0.3}
              />
            </div>
            <Divider />
          </Box>
        );
      })}
    </Card>
  );
};

export default OutcomesCard;
