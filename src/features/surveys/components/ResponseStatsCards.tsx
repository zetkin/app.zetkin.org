import { CSSProperties, FC, memo, useEffect, useMemo, useState } from 'react';
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
import { List } from 'react-window';
import ReactWordcloud, { OptionsProp, Word } from 'react-wordcloud';
import { ResponsivePie } from '@nivo/pie';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import {
  OptionsQuestionStats,
  QuestionStats,
  SubmissionStats,
  SurveyResponseStats,
  TextQuestionStats,
} from 'features/surveys/rpc/getSurveyResponseStats';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import range from 'utils/range';
import useSurveyResponseStats from 'features/surveys/hooks/useSurveyResponseStats';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import useSurveySubmission from 'features/surveys/hooks/useSurveySubmission';

const BAR_MAX_WIDTH = 100;
const TEXT_RESPONSE_CARD_HEIGHT = 150;
const CHART_HEIGHT = 400;

const COLORS = [
  'rgb(237, 28, 85)',
  'rgb(194,169,84)',
  'rgb(73,109,189)',
  'rgb(91,204,82)',
  'rgb(192,97,196)',
  'rgb(76,183,183)',
  'rgb(224,112,77)',
  'rgb(64,92,164)',
  'rgb(140,190,63)',
  'rgb(164,64,91)',
  'rgb(192,28,178)',
  'rgb(63,190,118)',
];

function ellipsize(s: string, limit: number = 40): string {
  return s.length <= limit ? s : s.slice(0, limit) + '…';
}

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

  const [spring, api] = useSpring(() => ({
    labelX: w / 2,
    transform: `translate(${x}, ${bar.y})`,
    width: w,
  }));

  useEffect(() => {
    api.start({
      labelX: w / 2,
      transform: `translate(${x}, ${bar.y})`,
      width: w,
    });
  }, [w, api, x, bar]);

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
            option: ellipsize(o.option.text),
          }))
        : Object.entries(question.topWordFrequencies).map(([word, count]) => ({
            count: count,
            option: ellipsize(word),
          }));
    return bars.sort((a, b) => b.count - a.count).slice(0, 10);
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
      colors={({ index }) => COLORS[index % COLORS.length]}
      data={data}
      enableGridX={false}
      enableGridY={true}
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

const QuestionStatsPie = ({ question }: { question: QuestionStats }) => {
  const theme = useTheme();

  const data = useMemo(() => {
    const items =
      'options' in question
        ? question.options.map((o) => ({
            id: ellipsize(o.option.text),
            label: ellipsize(o.option.text),
            value: o.count,
          }))
        : Object.entries(question.topWordFrequencies).map(([word, count]) => ({
            id: ellipsize(word),
            label: ellipsize(word),
            value: count,
          }));
    return items.sort((a, b) => b.value - a.value).slice(0, 10);
  }, [question]);

  return (
    <ResponsivePie
      animate={false}
      arcLinkLabel={(d) => `${d.id}: ${d.value}`}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLinkLabelsTextColor={theme.palette.text.primary}
      colors={COLORS}
      cornerRadius={3}
      data={data}
      enableArcLabels={false}
      enableArcLinkLabels={true}
      innerRadius={0.5}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          itemHeight: 14,
          itemWidth: 80,
          symbolSize: 12,
          translateY: 40,
        },
      ]}
      margin={{ bottom: 60, left: 60, right: 60, top: 40 }}
      padAngle={1}
      tooltip={({ datum }) => (
        <Paper>
          <Box p={1}>
            <Typography variant="body2">
              {datum.id}: {datum.value}
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
  const [tab, setTab] = useState('bar-plot');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.optionsFields.subheader({
        answerCount: questionStats.answerCount,
        totalSelectedOptionsCount: questionStats.totalSelectedOptionsCount,
      }),
    [questionStats, messages.insights.optionsFields.subheader]
  );

  return (
    <ZUICard
      header={questionStats.question.question.question}
      subheader={subheader}
      sx={{
        width: '100%',
      }}
    >
      <Tabs onChange={(_, selected) => setTab(selected)} value={tab}>
        <Tab
          label={messages.insights.optionsFields.tabs.barPlot()}
          value={'bar-plot'}
        />
        <Tab
          label={messages.insights.optionsFields.tabs.piePlot()}
          value={'pie-chart'}
        />
      </Tabs>
      <Box height={CHART_HEIGHT}>
        {tab === 'bar-plot' && (
          <QuestionStatsBarPlot question={questionStats} />
        )}
        {tab === 'pie-chart' && <QuestionStatsPie question={questionStats} />}
      </Box>
    </ZUICard>
  );
};

const WordCloud = memo(ReactWordcloud);

const TextResponseWordCloud = ({
  questionStats,
}: {
  questionStats: TextQuestionStats;
}) => {
  const words: Word[] = useMemo(
    () =>
      Object.entries(questionStats.topWordFrequencies).map(
        ([word, frequency]) => ({
          text: word,
          value: frequency,
        })
      ),
    [questionStats.topWordFrequencies]
  );

  const options: OptionsProp = useMemo(
    () => ({
      colors: COLORS,
      deterministic: true,
      fontFamily: 'Azo-Sans-Web',
      fontSizes: [30, 80],
      randomSeed: '42',
      rotationAngles: [0, 90],
      rotations: 2,
    }),
    []
  );

  return (
    <Box
      sx={{
        padding: '20px',
      }}
    >
      <WordCloud options={options} words={words} />
    </Box>
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
    <ZUIFuture
      future={extendedSubmissionFuture}
      skeleton={<Skeleton height={'100%'} variant={'rounded'} width={'100%'} />}
    >
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
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: '4',
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
  orgId: number;
  questionId: number;
  rows: SubmissionStats[][];
};

const TextResponseListRow = ({
  columnCount,
  index: rowIndex,
  orgId,
  questionId,
  style,
  rows,
}: TextResponseListRowProps & {
  index: number;
  style: CSSProperties;
}) => {
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
    <List<TextResponseListRowProps>
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
}: {
  orgId: number;
  questionStats: TextQuestionStats;
  submissionStats: SubmissionStats[];
}) => {
  const [tab, setTab] = useState('word-cloud');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.textFields.subheader({
        answerCount: questionStats.answerCount,
        totalUniqueWordCount: questionStats.totalUniqueWordCount,
        totalWordCount: questionStats.totalWordCount,
      }),
    [questionStats, messages.insights.textFields.subheader]
  );

  return (
    <ZUICard
      header={questionStats.question.question.question}
      subheader={subheader}
      sx={{
        width: '100%',
      }}
    >
      <Tabs onChange={(_, selected) => setTab(selected)} value={tab}>
        <Tab
          label={messages.insights.textFields.tabs.wordCloud()}
          value={'word-cloud'}
        />
        <Tab
          label={messages.insights.textFields.tabs.wordFrequencies()}
          value={'word-frequency-bars'}
        />
        <Tab
          label={messages.insights.textFields.tabs.responses()}
          value={'responses'}
        />
      </Tabs>
      <Box height={CHART_HEIGHT}>
        {tab === 'word-cloud' && (
          <TextResponseWordCloud questionStats={questionStats} />
        )}
        {tab === 'word-frequency-bars' && (
          <QuestionStatsBarPlot question={questionStats} />
        )}
        {tab === 'responses' && (
          <TextResponseList
            orgId={orgId}
            questionStats={questionStats}
            submissionStats={submissionStats}
          />
        )}
      </Box>
    </ZUICard>
  );
};

const LoadingStatsCard = () => {
  return (
    <ZUICard
      header={<Skeleton height={'100%'} width={150} />}
      subheader={<Skeleton height={'100%'} width={300} />}
      sx={{
        width: '100%',
      }}
    >
      <Skeleton
        height={30}
        sx={{ marginBottom: '10px' }}
        variant={'rounded'}
        width={200}
      />
      <Skeleton height={200} variant={'rounded'} width={'100%'} />
    </ZUICard>
  );
};

const ResponseStatsCards: FC<ResponseStatsChartCardProps> = ({
  orgId,
  surveyId,
}) => {
  const responseStatsFuture = useSurveyResponseStats(orgId, surveyId);

  return (
    <ZUIFuture
      future={responseStatsFuture}
      skeleton={
        <>
          {range(3).map((_, index) => (
            <LoadingStatsCard key={index} />
          ))}
        </>
      }
    >
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
