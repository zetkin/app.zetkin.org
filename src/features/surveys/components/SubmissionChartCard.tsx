import { FC } from 'react';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { Box, Card, Typography, useTheme } from '@mui/material';

import { Msg } from 'core/i18n';
import SurveyDataModel from '../models/SurveyDataModel';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

import messageIds from '../l10n/messageIds';

type SubmissionChartCardProps = {
  orgId: number;
  surveyId: number;
};

const SubmissionChartCard: FC<SubmissionChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const theme = useTheme();
  const model = useModel((env) => new SurveyDataModel(env, orgId, surveyId));

  return (
    <ZUIFuture future={model.getStats()}>
      {(data) => (
        <Card>
          <Box m={2}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5">
                  <Msg id={messageIds.chart.h} />
                </Typography>
              </Box>
              <Box>{data.submissionCount}</Box>
            </Box>
            <Box height={400}>
              <ResponsiveLine
                animate={false}
                axisBottom={{
                  format: '%b %d',
                }}
                colors={[theme.palette.primary.main]}
                curve="basis"
                data={[
                  {
                    data: data.submissionsByDay.map((day) => ({
                      x: day.date,
                      y: day.accumulatedSubmissions,
                    })),
                    id: data.id,
                  },
                ]}
                defs={[
                  linearGradientDef('gradientA', [
                    { color: 'inherit', offset: 0 },
                    { color: 'inherit', offset: 100, opacity: 0 },
                  ]),
                ]}
                enableArea={true}
                enableGridX={false}
                enableGridY={false}
                enablePoints={false}
                fill={[{ id: 'gradientA', match: '*' }]}
                lineWidth={3}
                margin={{
                  bottom: 20,
                  // Calculate the left margin from the number of digits
                  // in the submission count, to make sure the axis labels
                  // will fit inside the clipping rectangle.
                  left: 8 + data.submissionCount.toString().length * 8,
                  top: 20,
                }}
                xFormat="time:%Y-%m-%d"
                xScale={{
                  format: '%Y-%m-%d',
                  precision: 'day',
                  type: 'time',
                }}
              />
            </Box>
          </Box>
        </Card>
      )}
    </ZUIFuture>
  );
};

export default SubmissionChartCard;
