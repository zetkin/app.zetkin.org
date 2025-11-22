import { FC } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import useSurveyResponseStats from 'features/surveys/hooks/useSurveyResponseStats';
import {
  QuestionStats,
  SurveyResponseStats,
} from 'features/surveys/rpc/getSurveyResponseStats';

type ResponseStatsChartCardProps = {
  orgId: number;
  surveyId: number;
};

const QuestionBarChart = ({ question }: { question: QuestionStats }) => {
  const theme = useTheme();

  if (!('options' in question)) {
    return null;
  }

  const data = question.options.map((o) => ({
    count: o.count,
    option: o.option.text,
  }));

  return (
    <ResponsiveBar
      animate={false}
      axisBottom={{
        format: (v) => (Number.isInteger(v) ? v : ''),
        tickPadding: 5,
        tickSize: 0,
      }}
      axisLeft={{
        renderTick: (tick) => {
          const maxLen = 25; // tweak as you like
          const label =
            tick.value.length > maxLen
              ? tick.value.slice(0, maxLen) + '…'
              : tick.value;

          return (
            <g transform={`translate(${tick.x - 10},${tick.y})`}>
              <text
                alignmentBaseline="middle"
                style={{
                  fill: theme.palette.text.primary,
                  fontSize: 12,
                }}
                textAnchor="end"
              >
                {label}
              </text>
            </g>
          );
        },
        tickPadding: 5,
        tickSize: 0,
      }}
      axisRight={null}
      axisTop={null}
      colors={[theme.palette.primary.main]}
      data={data}
      enableGridX={true}
      enableGridY={false}
      gridXValues="auto" // big left margin for long text
      height={400}
      indexBy="option"
      keys={['count']}
      labelSkipHeight={20}
      labelSkipWidth={100}
      labelTextColor={() => theme.palette.primary.contrastText}
      layout="horizontal"
      margin={{ bottom: 20, left: 200, right: 20, top: 20 }}
      padding={0.3}
      tooltip={({ indexValue, value }) => (
        <Paper>
          <Box p={1}>
            <Typography variant="body2">
              {indexValue}: {value}
            </Typography>
          </Box>
        </Paper>
      )}
    />
  );
};

const ResponseStatsCard: FC<ResponseStatsChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const responseStatsFuture = useSurveyResponseStats(orgId, surveyId);

  return (
    <ZUIFuture future={responseStatsFuture}>
      {(data: SurveyResponseStats) => {
        return (
          <>
            {data.questions.map((question, index) => {
              return (
                <ZUICard
                  key={index}
                  header={question.question.question.question}
                  subheader={`${question.answerCount} answers in total.`}
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box height={400}>
                    <QuestionBarChart question={question} />
                  </Box>
                </ZUICard>
              );
            })}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default ResponseStatsCard;
