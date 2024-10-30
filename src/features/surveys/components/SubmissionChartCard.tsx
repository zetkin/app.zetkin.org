import { FC } from 'react';
import { FormattedDate } from 'react-intl';
import { linearGradientDef } from '@nivo/core';
import { ResponsiveLine } from '@nivo/line';
import { Box, Paper, Typography, useTheme } from '@mui/material';

import useSurveyStats from '../hooks/useSurveyStats';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import ZUINumberChip from 'zui/ZUINumberChip';
import { Msg, useMessages } from 'core/i18n';
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
  const messages = useMessages(messageIds);
  const statsFuture = useSurveyStats(orgId, surveyId);

  return (
    <ZUIFuture future={statsFuture}>
      {(data) => {
        const hasChartData = data.submissionsByDay.length > 1;

        return (
          <ZUICard
            header={messages.chart.header()}
            status={
              !!data.submissionCount && (
                <ZUINumberChip
                  color={theme.palette.grey[200]}
                  value={data.submissionCount}
                />
              )
            }
            subheader={
              data.submissionCount
                ? messages.chart.subheader({
                    days: data.submissionsByDay.length,
                  })
                : undefined
            }
          >
            <Box height={400}>
              {!hasChartData && (
                <Box
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  justifyContent="center"
                  width="100%"
                >
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginBottom={2}
                    width="100%"
                  >
                    <PlaceholderVisual />
                  </Box>
                  <Typography
                    sx={{
                      color: theme.palette.text.disabled,
                      textAlign: 'center',
                    }}
                  >
                    <Msg id={messageIds.chart.placeholder} />
                  </Typography>
                </Box>
              )}
              {hasChartData && (
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
                  enableSlices="x"
                  fill={[{ id: 'gradientA', match: '*' }]}
                  isInteractive={true}
                  lineWidth={3}
                  margin={{
                    bottom: 20,
                    // Calculate the left margin from the number of digits
                    // in the submission count, to make sure the axis labels
                    // will fit inside the clipping rectangle.
                    left: 8 + data.submissionCount.toString().length * 8,
                    top: 20,
                  }}
                  sliceTooltip={(props) => {
                    const dataPoint = props.slice.points[0];
                    const date = new Date(dataPoint.data.xFormatted);

                    return (
                      <Paper>
                        <Box p={1}>
                          <Typography variant="h6">
                            <FormattedDate value={date} />
                          </Typography>
                          <Typography variant="body2">
                            <Msg
                              id={messageIds.chart.tooltip.submissions}
                              values={{ count: dataPoint.data.y as number }}
                            />
                          </Typography>
                        </Box>
                      </Paper>
                    );
                  }}
                  xFormat="time:%Y-%m-%d"
                  xScale={{
                    format: '%Y-%m-%d',
                    precision: 'day',
                    type: 'time',
                  }}
                />
              )}
            </Box>
          </ZUICard>
        );
      }}
    </ZUIFuture>
  );
};

const PlaceholderVisual: FC = () => {
  return (
    <svg
      fill="none"
      height="167"
      viewBox="0 0 851 167"
      width="851"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 165.5C3 165.5 185.485 -117.14 424.243 61.946C663 241.032 849 61.7515 849 61.7515"
        stroke="black"
        strokeDasharray="10 30"
        strokeOpacity="0.15"
        strokeWidth="5"
      />
    </svg>
  );
};

export default SubmissionChartCard;
