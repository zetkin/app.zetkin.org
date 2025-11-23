import { CSSProperties, FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Paper,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import { BarDatum, BarItem, BarItemProps, ResponsiveBar } from '@nivo/bar';
import { useSpring } from '@react-spring/core';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import useSurveyResponseStats from 'features/surveys/hooks/useSurveyResponseStats';
import {
  OptionsQuestionStats,
  QuestionStats,
  SubmissionStats,
  SurveyResponseStats,
  TextQuestionStats,
} from 'features/surveys/rpc/getSurveyResponseStats';
import useSurveySubmissions from 'features/surveys/hooks/useSurveySubmissions';
import { IFuture } from 'core/caching/futures';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import { List } from 'react-window';
import useSurveySubmission from 'features/surveys/hooks/useSurveySubmission';

const BAR_MAX_WIDTH = 100;
const TEXT_RESPONSE_CARD_HEIGHT = 150;

type ResponseStatsChartCardProps = {
  orgId: number;
  surveyId: number;
};

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

const QuestionStatsBarPlot = ({ question }: { question: QuestionStats }) => {
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

const OptionsStatsCard = ({
  questionStats,
}: {
  questionStats: OptionsQuestionStats;
}) => {
  return (
    <ZUICard
      header={questionStats.question.question.question}
      subheader={`${questionStats.answerCount} answers in total. ${questionStats.totalSelectedOptionsCount} selected options in total.`}
      sx={{
        width: '100%',
      }}
    >
      <Box height={400}>
        <QuestionStatsBarPlot question={questionStats} />
      </Box>
    </ZUICard>
  );
};

const TextResponseCard = ({
  orgId,
  questionId,
  submission,
}: {
  orgId: number;
  questionId: number;
  submission: SubmissionStats;
}) => {
  const extendedSubmissionFuture = useSurveySubmission(
    orgId,
    submission.submissionId
  );

  return (
    <ZUIFuture future={extendedSubmissionFuture}>
      {(extendedSubmission: ZetkinSurveySubmission) => {
        if (!extendedSubmission.responses) {
          return null;
        }

        const questionResponse = extendedSubmission.responses.find(
          (response) => response.question_id === questionId
        );

        if (!questionResponse || !('response' in questionResponse)) {
          return null;
        }

        return (
          <Card
            sx={{
              display: 'flex',
              height: '100%',
              width: '100%',
            }}
          >
            <CardContent>
              <Typography
                sx={{
                  '-webkit-box-orient': 'vertical',
                  '-webkit-line-clamp': '4',
                  display: '-webkit-box',
                  overflow: 'hidden',
                }}
              >
                {questionResponse.response}
              </Typography>
            </CardContent>
          </Card>
        );
      }}
    </ZUIFuture>
  );
};

type TextResponseListRowProps = {
  columnCount: number;
  index: number;
  orgId: number;
  questionId: number;
  style: CSSProperties;
  rows: SubmissionStats[][];
};

const TextResponseListRow = ({
  columnCount,
  index: rowIndex,
  orgId,
  questionId,
  style,
  rows,
}: TextResponseListRowProps) => {
  const row = rows[rowIndex];

  return (
    <Box
      style={style}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: TEXT_RESPONSE_CARD_HEIGHT,
        width: '100%',
      }}
    >
      {row.map((submission, colIndex) => {
        return (
          <Box
            key={colIndex}
            sx={{
              display: 'flex',
              height: TEXT_RESPONSE_CARD_HEIGHT,
              padding: '10px',
              width: `${100.0 / columnCount}%`,
            }}
          >
            <TextResponseCard
              orgId={orgId}
              questionId={questionId}
              submission={submission}
            />
          </Box>
        );
      })}
    </Box>
  );
};

function chunk<T>(xs: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < xs.length; i += size) {
    res.push(xs.slice(i, i + size));
  }
  return res;
}

const TextResponseList = ({
  orgId,
  questionStats,
  submissionStats,
}: {
  orgId: number;
  questionStats: TextQuestionStats;
  submissionStats: SubmissionStats[];
}) => {
  const columnCount = 2;

  const rows = useMemo(
    () =>
      chunk(
        submissionStats.filter((submission) =>
          submission.answeredTextQuestions.some(
            (questionId) => questionId === questionStats.question.id
          )
        ),
        columnCount
      ),
    [submissionStats, columnCount, questionStats.question.id]
  );

  const rowProps = useMemo(
    () => ({
      columnCount,
      orgId,
      questionId: questionStats.question.id,
      rows,
    }),
    [columnCount, orgId, questionStats.question.id, rows]
  );

  if (!rows) {
    return null;
  }

  return (
    <List
      rowComponent={TextResponseListRow}
      rowCount={rows.length}
      rowHeight={TEXT_RESPONSE_CARD_HEIGHT}
      rowProps={rowProps}
      style={{
        height: TEXT_RESPONSE_CARD_HEIGHT * rows.length,
      }}
    />
  );
};

const TextStatsCard = ({
  orgId,
  questionStats,
  submissionStats,
  surveyId,
}: {
  orgId: number;
  questionStats: TextQuestionStats;
  submissionStats: SubmissionStats[];
  surveyId: number;
}) => {
  const [tab, setTab] = useState('responses');

  return (
    <ZUICard
      header={questionStats.question.question.question}
      subheader={`${questionStats.answerCount} answers in total. ${questionStats.totalWordCount} words in total. ${questionStats.totalUniqueWordCount} total unique words per response.`}
      sx={{
        width: '100%',
      }}
    >
      <Tabs onChange={(_, selected) => setTab(selected)} value={tab}>
        <Tab label={'Responses'} value={'responses'} />
        <Tab label={'Bar plot'} value={'bar-plot'} />
      </Tabs>
      {tab === 'responses' && (
        <Box display={'flex'} height={400} position={'relative'}>
          <TextResponseList
            orgId={orgId}
            questionStats={questionStats}
            submissionStats={submissionStats}
            surveyId={surveyId}
          />
        </Box>
      )}
      {tab === 'bar-plot' && (
        <Box height={400}>
          <QuestionStatsBarPlot question={questionStats} />
        </Box>
      )}
    </ZUICard>
  );
};

const ResponseStatsCards: FC<ResponseStatsChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const responseStatsFuture = useSurveyResponseStats(orgId, surveyId);

  return (
    <ZUIFuture future={responseStatsFuture}>
      {(data: SurveyResponseStats) => {
        return (
          <>
            {data.questions.map((questionStats, index) =>
              'options' in questionStats ? (
                <OptionsStatsCard key={index} questionStats={questionStats} />
              ) : (
                <TextStatsCard
                  key={index}
                  orgId={orgId}
                  questionStats={questionStats}
                  submissionStats={data.submissionStats}
                  surveyId={surveyId}
                />
              )
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default ResponseStatsCards;
