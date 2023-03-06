import { FC } from 'react';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { Box, useTheme } from '@mui/material';

import SurveyDataModel from '../models/SurveyDataModel';
import { useMessages } from 'core/i18n';
import useModel from 'core/useModel';
import ZUIFuture from 'zui/ZUIFuture';

import messageIds from '../l10n/messageIds';
import ZUICard from 'zui/ZUICard';
import ZUINumberChip from 'zui/ZUINumberChip';

type SubmissionChartCardProps = {
  orgId: number;
  surveyId: number;
};

const SubmissionChartCard: FC<SubmissionChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const model = useModel((env) => new SurveyDataModel(env, orgId, surveyId));

  return (
    <ZUIFuture future={model.getStats()}>
      {(data) => (
        <ZUICard
          header={messages.chart.h()}
          status={
            <ZUINumberChip
              color={theme.palette.grey[200]}
              value={data.submissionCount}
            />
          }
        >
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
        </ZUICard>
      )}
    </ZUIFuture>
  );
};

export default SubmissionChartCard;
