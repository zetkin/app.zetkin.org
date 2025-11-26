import React, {
  CSSProperties,
  FC,
  memo,
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { List } from 'react-window';
import ReactWordcloud, { OptionsProp, Word } from 'react-wordcloud';
import ImageIcon from '@mui/icons-material/Image';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import NextLink from 'next/link';

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
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { useNumericRouteParams } from 'core/hooks';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIToggleButton from 'zui/components/ZUIToggleButton';

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

async function svgToPng(svgEl: SVGSVGElement, scale = 1) {
  const svgData = new XMLSerializer().serializeToString(svgEl);

  // Ensure XML header — Windows cares
  const svgWithHeader = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgData;

  // SVG → Blob
  const svgBlob = new Blob([svgWithHeader], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);

      URL.revokeObjectURL(url);

      // Real PNG blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create PNG blob'));
          }
        },
        'image/png',
        1.0
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}

function download(filename: string, content: string | Blob) {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    typeof content === 'string'
      ? 'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
      : URL.createObjectURL(content)
  );
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function sanitizeFileName(name: string) {
  // Replace Windows-forbidden chars + control chars
  const control = Array.from({ length: 32 }, (_, i) =>
    String.fromCharCode(i)
  ).join('');
  const forbidden = new RegExp(`[<>:"/\\\\|?*${control}]`, 'g');
  name = name.replace(forbidden, '_');

  // Collapse underscores
  name = name.replace(/_+/g, '_');

  // Trim spaces/dots from ends (Windows hates them)
  name = name.replace(/^[ .]+|[ .]+$/g, '');

  if (!name) {
    name = 'file';
  }

  // Enforce 255-byte limit
  if (new TextEncoder().encode(name).length > 255) {
    const enc = new TextEncoder().encode(name);
    name = new TextDecoder().decode(enc.slice(0, 255));
  }

  return name;
}

const ChartWrapper = ({
  children,
  exportFileName,
}: {
  children: ReactElement;
  exportFileName: string;
}) => {
  const messages = useMessages(messageIds);
  const ref = useRef<HTMLDivElement | null>(null);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const exportChart = useCallback(
    async (format: 'png' | 'svg') => {
      try {
        const wrapper = ref.current;

        if (!wrapper) {
          showSnackbar('error', messages.insights.export.errorNotFound());
          return;
        }

        const elements = wrapper.getElementsByTagName('svg');
        if (elements.length === 0) {
          showSnackbar('error', messages.insights.export.errorNotFound());
          return;
        }

        const svgRoot = elements[0];

        const fileName = sanitizeFileName(exportFileName);

        if (format === 'png') {
          const pngBlob = await svgToPng(svgRoot);
          download(`${fileName}.png`, pngBlob);
        } else if (format === 'svg') {
          const svgStr = new XMLSerializer().serializeToString(svgRoot);
          download(`${fileName}.svg`, svgStr);
        }
      } catch (e) {
        showSnackbar('error', messages.insights.export.errorUnknown());
      }
    },
    [showSnackbar, ref, exportFileName]
  );

  const ellipsisMenuItems = useMemo(
    () => [
      {
        label: messages.insights.export.toPng(),
        onSelect: () => exportChart('png'),
        startIcon: <ImageIcon />,
      },
      {
        label: messages.insights.export.toSvg(),
        onSelect: () => exportChart('svg'),
        startIcon: <ArchitectureIcon />,
      },
    ],
    [exportChart]
  );

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <Box sx={{ position: 'absolute', right: 10, top: 10, zIndex: 10 }}>
        <ZUIEllipsisMenu items={ellipsisMenuItems} />
      </Box>
      <Box ref={ref} sx={{ height: '100%', width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

function ellipsize(s: string, limit: number = 40): string {
  return s.length <= limit ? s : s.slice(0, limit) + '…';
}

const QuestionStatsBarPlot = ({
  questionStats,
}: {
  questionStats: QuestionStats;
}) => {
  const theme = useTheme();

  const data = useMemo(() => {
    const bars =
      'options' in questionStats
        ? questionStats.options.map((o) => ({
            count: o.count,
            option: o.option.text,
          }))
        : Object.entries(questionStats.topWordFrequencies).map(
            ([word, count]) => ({
              count: count,
              option: word,
            })
          );
    let sorted = bars.sort((a, b) => b.count - a.count);
    if (!('options' in questionStats)) {
      sorted = sorted.slice(0, 10);
    }
    return sorted;
  }, [questionStats]);

  return (
    <ChartWrapper exportFileName={questionStats.question.question.question}>
      <BarChartPro
        grid={{
          vertical: true,
        }}
        height={CHART_HEIGHT}
        layout={'horizontal'}
        series={[
          {
            data: data.map((option) => option.count),
          },
        ]}
        slotProps={{
          tooltip: {
            sx: {
              caption: {
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              maxWidth: '60vw',
              overflow: 'hidden',
            },
          },
        }}
        sx={{
          '.MuiChartsAxis-tick': {
            stroke: `${theme.palette.grey['700']} !important`,
          },
        }}
        xAxis={[
          {
            disableLine: true,
            tickLabelStyle: { fill: theme.palette.grey['700'] },
          },
        ]}
        yAxis={[
          {
            colorMap: {
              colors: COLORS,
              type: 'ordinal',
            },
            data: data.map((option) => option.option),
            disableLine: true,
            disableTicks: true,
            id: 'barCategories',
            tickLabelStyle: { fill: theme.palette.common.black },
            width: 200,
          },
        ]}
      />
    </ChartWrapper>
  );
};

const QuestionStatsPie = ({ question }: { question: QuestionStats }) => {
  const data = useMemo(() => {
    const items =
      'options' in question
        ? question.options.map((o) => ({
            label: ellipsize(o.option.text, 60),
            value: o.count,
          }))
        : Object.entries(question.topWordFrequencies).map(([word, count]) => ({
            label: ellipsize(word, 60),
            value: count,
          }));
    return items
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ value, label }, index) => ({
        color: COLORS[index % COLORS.length],
        label,
        value,
      }));
  }, [question]);

  return (
    <ChartWrapper exportFileName={question.question.question.question}>
      <PieChartPro
        series={[
          { arcLabel: 'value', data, innerRadius: 80, outerRadius: 180 },
        ]}
        slotProps={{
          pieArc: {
            strokeWidth: 2,
          },
          pieArcLabel: {
            fill: 'white',
          },
        }}
        sx={{
          '.MuiPieArcLabel-root': {
            fill: 'white !important',
          },
          gap: '20px',
        }}
        width={360}
      />
    </ChartWrapper>
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
        position: 'relative',
        width: '100%',
      }}
    >
      <ZUIToggleButton
        onChange={(selected) => selected && setTab(selected)}
        options={[
          {
            label: messages.insights.optionsFields.tabs.barPlot(),
            value: 'bar-plot',
          },
          {
            label: messages.insights.optionsFields.tabs.piePlot(),
            value: 'pie-chart',
          },
        ]}
        size={'small'}
        value={tab}
      />
      <Box height={CHART_HEIGHT}>
        {tab === 'bar-plot' && (
          <QuestionStatsBarPlot questionStats={questionStats} />
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
      fontFamily: `'AzoSansWeb', 'Helvetica Neue', Helvetica, Arial, sans-serif`,
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
        display: 'flex',
        height: '100%',
        padding: '20px',
        width: '100%',
      }}
    >
      <ChartWrapper exportFileName={questionStats.question.question.question}>
        <WordCloud options={options} words={words} />
      </ChartWrapper>
    </Box>
  );
};

const TextResponseCard = ({
  questionId,
  submission,
}: {
  questionId: number;
  submission: SubmissionStats;
}) => {
  const { orgId, campId, surveyId } = useNumericRouteParams();
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
          <NextLink
            href={`/organize/${orgId}/projects/${campId}/surveys/${surveyId}/submissions?openSubmission=${extendedSubmission.id}`}
            style={{
              display: 'flex',
              height: '100%',
              width: '100%',
            }}
          >
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
                    wordBreak: 'break-word',
                  }}
                >
                  {questionResponse.response}
                </Typography>
              </CardContent>
            </Card>
          </NextLink>
        );
      }}
    </ZUIFuture>
  );
};

type TextResponseListRowProps = {
  columnCount: number;
  questionId: number;
  rows: SubmissionStats[][];
};

const TextResponseListRow = ({
  columnCount,
  index: rowIndex,
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
            <TextResponseCard questionId={questionId} submission={submission} />
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
  questionStats,
  submissionStats,
}: {
  questionStats: TextQuestionStats;
  submissionStats: SubmissionStats[];
}) => {
  const theme = useTheme();
  const singleColumnLayout = useMediaQuery(theme.breakpoints.down('lg'));

  const columnCount = singleColumnLayout ? 1 : 2;

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
      questionId: questionStats.question.id,
      rows,
    }),
    [columnCount, questionStats.question.id, rows]
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
  questionStats,
  submissionStats,
}: {
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
        position: 'relative',
        width: '100%',
      }}
    >
      <ZUIToggleButton
        onChange={(selected) => selected && setTab(selected)}
        options={[
          {
            label: messages.insights.textFields.tabs.wordCloud(),
            value: 'word-cloud',
          },
          {
            label: messages.insights.textFields.tabs.wordFrequencies(),
            value: 'word-frequency-bars',
          },
          {
            label: messages.insights.textFields.tabs.responses(),
            value: 'responses',
          },
        ]}
        size={'small'}
        value={tab}
      />
      <Box height={CHART_HEIGHT}>
        {tab === 'word-cloud' && (
          <TextResponseWordCloud questionStats={questionStats} />
        )}
        {tab === 'word-frequency-bars' && (
          <QuestionStatsBarPlot questionStats={questionStats} />
        )}
        {tab === 'responses' && (
          <TextResponseList
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

type ResponseStatsChartCardProps = {
  orgId: number;
  surveyId: number;
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
