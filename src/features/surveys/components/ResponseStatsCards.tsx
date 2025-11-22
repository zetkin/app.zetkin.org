import { FC, useEffect, useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { BarDatum, BarItem, BarItemProps, ResponsiveBar } from '@nivo/bar';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import useSurveyResponseStats from 'features/surveys/hooks/useSurveyResponseStats';
import {
  QuestionStats,
  SurveyResponseStats,
} from 'features/surveys/rpc/getSurveyResponseStats';
import { useSpring } from '@react-spring/core';

type ResponseStatsChartCardProps = {
  orgId: number;
  surveyId: number;
};

const BAR_MAX_WIDTH = 100;

const CustomBarComponent = <RawDatum extends BarDatum>(
  props: BarItemProps<RawDatum>
) => {
  const {
    bar: { data, ...bar },
    style,
  } = props;

  const w = Math.min(bar.width, BAR_MAX_WIDTH);
  const x = bar.x + bar.width / 2 - w / 2;

  const [spring, setSpring] = useSpring(() => ({
    labelX: w / 2,
    transform: `translate(${x}, ${bar.y})`,
    width: w,
  }));

  useEffect(() => {
    setSpring({
      labelX: w / 2,
      transform: `translate(${x}, ${bar.y})`,
      width: w,
    });
  }, [w, setSpring, x, bar]);

  return (
    <BarItem
      {...props}
      bar={{ ...bar, data, width: w, x }}
      style={{ ...style, ...spring }}
    />
  );
};

const ResponseStatsCards = ({ question }: { question: QuestionStats }) => {
  const theme = useTheme();

  const data = useMemo(() => {
    const bars =
      'options' in question
        ? question.options.map((o) => ({
            count: o.count,
            option: o.option.text,
          }))
        : Object.entries(question.topWordFrequencies).map(([word, count]) => ({
            count: count,
            option: word,
          }));
    return bars.sort((a, b) => b.count - a.count);
  }, [question]);

  return (
    <ResponsiveBar
      animate={false}
      axisBottom={{
        tickPadding: 5,
        tickSize: 0,
      }}
      axisLeft={{
        format: (v) => (Number.isInteger(v) ? v : ''),
        tickPadding: 5,
        tickSize: 0,
      }}
      axisRight={null}
      axisTop={null}
      barComponent={CustomBarComponent}
      colors={[theme.palette.primary.main]}
      data={data}
      enableGridX={false}
      enableGridY={true}
      height={400}
      indexBy="option"
      keys={['count']}
      labelSkipHeight={20}
      labelSkipWidth={20}
      labelTextColor={() => theme.palette.primary.contrastText}
      layout="vertical"
      margin={{ bottom: 60, left: 60, right: 20, top: 20 }}
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
            {data.questions.map((questionStats, index) => {
              return (
                <ZUICard
                  key={index}
                  header={questionStats.question.question.question}
                  subheader={`${questionStats.answerCount} answers in total. ${
                    'options' in questionStats
                      ? `${questionStats.totalSelectedOptionsCount} selected options in total.`
                      : `${questionStats.totalWordCount} words in total. ${
                          questionStats.totalUniqueWordCount
                        } total unique words per response. Showing top ${
                          Object.entries(questionStats.topWordFrequencies)
                            .length
                        } word frequencies in free text question:`
                  }`}
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box height={400}>
                    <ResponseStatsCards question={questionStats} />
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
