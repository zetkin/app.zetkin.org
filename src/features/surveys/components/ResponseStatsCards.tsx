import React, {
  CSSProperties,
  FC,
  MutableRefObject,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Skeleton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { List } from 'react-window';
import { Wordcloud } from '@visx/wordcloud';
import {
  BarChartPro,
  BarChartProPluginSignatures,
} from '@mui/x-charts-pro/BarChartPro';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import {
  ChartImageExportOptions,
  ChartPrintExportOptions,
  useChartProExport,
  UseChartProExportSignature,
} from '@mui/x-charts-pro';
import { ChartPluginOptions } from '@mui/x-charts/internals';
import { ChartPublicAPI } from '@mui/x-charts/internals/plugins/models';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import { BoxOwnProps } from '@mui/system/Box/Box';
import { scaleLog } from 'd3-scale';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import {
  isOptionsStats,
  isTextResponse,
  isTextStats,
  OptionsQuestionStats,
  QuestionStats,
  SubmissionStats,
  SurveyResponseStats,
  TextQuestionStats,
} from 'features/surveys/rpc/getSurveyResponseStats';
import { ZetkinSurveySubmission } from 'utils/types/zetkin';
import range from 'utils/range';
import useSurveyResponseStats from 'features/surveys/hooks/useSurveyResponseStats';
import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import useSurveySubmission from 'features/surveys/hooks/useSurveySubmission';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { useNumericRouteParams } from 'core/hooks';
import { getEllipsedString, sanitizeFileName } from 'utils/stringUtils';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import useResizeObserver from 'zui/hooks/useResizeObserver';

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

export interface UseChartProExportPublicApi {
  exportAsPrint: (options?: ChartPrintExportOptions) => Promise<void>;
  exportAsImage: (options?: ChartImageExportOptions) => Promise<void>;
}

const ResponseStatsCard = ({
  children,
  exportApi,
  exportDisabled,
  onTabChange,
  questionStats,
  subheader,
  tabOptions,
  tabValue,
}: {
  children: ReactNode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  exportDisabled: boolean;
  onTabChange: (tab: string) => void;
  questionStats: QuestionStats;
  subheader: string;
  tabOptions: { label: string; value: string }[];
  tabValue: string;
}) => {
  const theme = useTheme();
  const messages = useMessages(messageIds);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { showSnackbar } = useContext(ZUISnackbarContext);

  const exportChart = useCallback(
    async (format: 'png' | 'pdf') => {
      const docOverflow = document.body.style.overflow;
      try {
        if (!exportApi.current) {
          throw new Error('mui charts api not defined');
        }

        await new Promise((resolve) => requestAnimationFrame(resolve));
        document.body.style.overflow = 'hidden';

        if (format === 'png') {
          await exportApi.current.exportAsImage({
            fileName: sanitizeFileName(
              questionStats.question.question.question
            ),
            onBeforeExport: (iframe) => {
              const doc = iframe.contentDocument;
              if (!doc || !containerRef.current) {
                return;
              }

              const contentOverrides =
                containerRef.current.getElementsByClassName(
                  'zetkin-chart-content'
                );
              const contentBox =
                contentOverrides.length > 0
                  ? contentOverrides[0]
                  : containerRef.current;

              const boundingRect = contentBox.getBoundingClientRect();
              doc.body.style.width = `${boundingRect.width}px`;
              doc.body.style.height = `${boundingRect.height}px`;
            },
            type: 'image/png',
          });
        } else if (format === 'pdf') {
          await exportApi.current.exportAsPrint();
        }
      } catch (e) {
        showSnackbar('error', messages.insights.export.errorUnknown());
      } finally {
        document.body.style.overflow = docOverflow;
      }
    },
    [
      showSnackbar,
      containerRef,
      exportApi,
      questionStats.question.question.question,
    ]
  );

  const exportMenuItems = useMemo(
    () => [
      {
        label: messages.insights.export.toPng(),
        onSelect: () => exportChart('png'),
      },
      {
        label: messages.insights.export.toPdf(),
        onSelect: () => exportChart('pdf'),
      },
    ],
    [exportChart]
  );

  const [exportMenuAnchorEl, setExportMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const exportMenuOpen = !!exportMenuAnchorEl;
  const exportMenuHandleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setExportMenuAnchorEl(event.currentTarget);
    },
    [setExportMenuAnchorEl]
  );
  const exportMenuHandleClose = useCallback(() => {
    setExportMenuAnchorEl(null);
  }, []);

  return (
    <ZUICard
      header={questionStats.question.question.question}
      status={
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            gap: '5px',
            height: '100%',
          }}
        >
          <ToggleButtonGroup
            exclusive
            onChange={(_, newValue) => newValue && onTabChange(newValue)}
            orientation={'horizontal'}
            size={'small'}
            value={tabValue}
          >
            {tabOptions.map((option) => (
              <ToggleButton
                key={option.value}
                size={'small'}
                value={option.value}
              >
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Box>
            <Button
              disabled={exportDisabled}
              onClick={exportMenuHandleClick}
              sx={{
                color: exportDisabled
                  ? theme.palette.grey['400']
                  : theme.palette.grey['800'],
              }}
            >
              <DownloadIcon />
            </Button>
            <Menu
              anchorEl={exportMenuAnchorEl}
              onClose={exportMenuHandleClose}
              open={exportMenuOpen}
            >
              {exportMenuItems.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={async () => {
                    exportMenuHandleClose();
                    await item.onSelect();
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
      }
      subheader={subheader}
      sx={{
        position: 'relative',
        width: '100%',
      }}
    >
      <Divider />
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          paddingTop: '5px',
          width: '100%',
        }}
      >
        {children}
      </Box>
    </ZUICard>
  );
};

const ChartWrapper = (props: BoxOwnProps) => {
  const { children, ...other } = props;
  return (
    <Box className={'zetkin-chart-content'} {...other}>
      {children}
    </Box>
  );
};

const QuestionStatsBarPlot = ({
  exportApi,
  questionStats,
}: {
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  questionStats: QuestionStats;
}) => {
  const theme = useTheme();

  const data = useMemo(() => {
    const bars = isOptionsStats(questionStats)
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
    if (isTextStats(questionStats)) {
      sorted = sorted.slice(0, 10);
    }
    return sorted;
  }, [questionStats]);

  return (
    <ChartWrapper>
      <BarChartPro
        apiRef={
          exportApi as unknown as RefObject<
            ChartPublicAPI<BarChartProPluginSignatures> | undefined
          >
        }
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
          height: CHART_HEIGHT,
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

const QuestionStatsPie = ({
  exportApi,
  questionStats,
}: {
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  questionStats: QuestionStats;
}) => {
  const data = useMemo(() => {
    const items = isOptionsStats(questionStats)
      ? questionStats.options.map((o) => ({
          label: getEllipsedString(o.option.text, 60),
          value: o.count,
        }))
      : Object.entries(questionStats.topWordFrequencies).map(
          ([word, count]) => ({
            label: getEllipsedString(word, 60),
            value: count,
          })
        );
    return items
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(({ value, label }, index) => ({
        color: COLORS[index % COLORS.length],
        label,
        value,
      }));
  }, [questionStats]);
  const messages = useMessages(messageIds);
  const [hasSeenPieInaccuracyWarning, setHasSeenPieInaccuracyWarning] =
    useState(false);

  return (
    <>
      {isOptionsStats(questionStats) &&
        !!questionStats.multipleSelectedOptionsCount && (
          <Collapse in={!hasSeenPieInaccuracyWarning}>
            <Alert
              action={
                <IconButton
                  onClick={() => setHasSeenPieInaccuracyWarning(true)}
                  size={'small'}
                >
                  <CloseIcon fontSize={'inherit'} />
                </IconButton>
              }
              severity={'warning'}
            >
              {messages.insights.optionsFields.warningMultipleSelectedOptionsPie(
                {
                  respondentCount: questionStats.multipleSelectedOptionsCount,
                }
              )}
            </Alert>
          </Collapse>
        )}
      <ChartWrapper>
        <PieChartPro
          apiRef={
            exportApi as unknown as MutableRefObject<UseChartProExportPublicApi>
          }
          height={CHART_HEIGHT}
          series={[
            {
              arcLabel: 'value',
              cornerRadius: 5,
              data,
              innerRadius: 80,
              outerRadius: 180,
            },
          ]}
          slotProps={{
            pieArc: {
              strokeWidth: 3,
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
    </>
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

  const exportApi = useRef<UseChartProExportPublicApi>();

  return (
    <ResponseStatsCard
      exportApi={exportApi}
      exportDisabled={false}
      onTabChange={(selected) => setTab(selected)}
      questionStats={questionStats}
      subheader={subheader}
      tabOptions={[
        {
          label: messages.insights.optionsFields.tabs.barPlot(),
          value: 'bar-plot',
        },
        {
          label: messages.insights.optionsFields.tabs.piePlot(),
          value: 'pie-chart',
        },
      ]}
      tabValue={tab}
    >
      {tab === 'bar-plot' && (
        <QuestionStatsBarPlot
          exportApi={exportApi}
          questionStats={questionStats}
        />
      )}
      {tab === 'pie-chart' && (
        <QuestionStatsPie exportApi={exportApi} questionStats={questionStats} />
      )}
    </ResponseStatsCard>
  );
};

interface WordData {
  text: string;
  value: number;
}
const WordCloudFixedValueGenerator = () => 0.5;

/**
 * Deterministically generate random numbers using a Linear Congruential Generator (LCG). NOT SAFE for cryptography.
 * @param seed the initial seed
 * @returns A pseudo-random number in the interval [0, 1]
 */
export function makeDeterministicRNG(seed: number) {
  let state = seed;

  // Linear Congruential Generator (LCG), Numerical Recipes parameters: https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
  const LCG_MULTIPLIER = 1664525;
  const LCG_INCREMENT = 1013904223;
  const UINT32_MAX = 0xffffffff;

  return function nextUniform01() {
    // advance RNG state (32-bit wraparound)
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) >>> 0;

    return state / UINT32_MAX;
  };
}

const wordCloudTextStyle: CSSProperties = {
  transition: 'transform 200ms ease',
};

const TextResponseWordCloud = ({
  exportApi,
  questionStats,
}: {
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  questionStats: TextQuestionStats;
}) => {
  const words: WordData[] = useMemo(
    () =>
      Object.entries(questionStats.topWordFrequencies).map(
        ([word, frequency]) => ({
          text: word,
          value: frequency,
        })
      ),
    [questionStats.topWordFrequencies]
  );

  const containerRef = useRef<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>();

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const svgElements = containerRef.current.getElementsByTagName('svg');
    if (svgElements.length === 0) {
      return;
    }
    svgRef.current = svgElements[0];
  });

  const exportOptions = useMemo(
    () =>
      ({
        chartRootRef: containerRef,
        instance: {
          disableAnimation: () => () => {},
        },
        svgRef: svgRef,
      } as ChartPluginOptions<UseChartProExportSignature>),
    []
  );

  const { publicAPI } = useChartProExport(exportOptions);
  useEffect(() => {
    exportApi.current = publicAPI as UseChartProExportPublicApi;
  }, [publicAPI]);

  const [width, setWidth] = useState(600);

  const onResize = useCallback(
    (elem: HTMLElement) => {
      setWidth(elem.clientWidth);
    },
    [setWidth]
  );

  const getRotationDegree = useMemo(() => {
    const rng = makeDeterministicRNG(42);
    return () => (rng() > 0.5 ? 0 : 90);
  }, [words, width]);

  const fontScale = useMemo(() => {
    const values = words.map((w) => w.value);
    const fontScaleFac = 0.5 + width / 3000;
    return scaleLog()
      .domain([Math.min(...values), Math.max(...values)])
      .range([20 * fontScaleFac, 70 * fontScaleFac]);
  }, [words, width]);
  const fontSizeSetter = useCallback(
    (datum: WordData) => fontScale(datum.value),
    [fontScale]
  );

  const resizeObserverRef = useResizeObserver(onResize);

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        width: '100%',
      }}
    >
      <Box ref={containerRef} sx={{ height: '100%', width: '100%' }}>
        <ChartWrapper sx={{ height: '100%', width: '100%' }}>
          <Box
            ref={resizeObserverRef}
            sx={{
              cursor: 'default',
              height: '100%',
              userSelect: 'none',
              width: '100%',
            }}
          >
            <Wordcloud
              font={`'AzoSansWeb', 'Helvetica Neue', Helvetica, Arial, sans-serif`}
              fontSize={fontSizeSetter}
              height={CHART_HEIGHT}
              padding={2}
              random={WordCloudFixedValueGenerator}
              rotate={getRotationDegree}
              spiral={'archimedean'}
              width={width}
              words={words}
            >
              {(cloudWords) =>
                cloudWords.map((w, i) => (
                  <Tooltip
                    key={w.text}
                    title={
                      w.text &&
                      `${w.text}: ${questionStats.topWordFrequencies[w.text]}`
                    }
                  >
                    <text
                      fill={COLORS[i % COLORS.length]}
                      fontFamily={w.font}
                      fontSize={w.size}
                      style={wordCloudTextStyle}
                      textAnchor={'middle'}
                      transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                    >
                      {w.text}
                    </text>
                  </Tooltip>
                ))
              }
            </Wordcloud>
          </Box>
        </ChartWrapper>
      </Box>
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
  const { orgId } = useNumericRouteParams();
  const extendedSubmissionFuture = useSurveySubmission(
    orgId,
    submission.submissionId
  );
  const { openPane } = usePanes();

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

        if (!questionResponse || !isTextResponse(questionResponse)) {
          return null;
        }

        return (
          <Link
            onClick={() => {
              openPane({
                render() {
                  return (
                    <SurveySubmissionPane
                      id={extendedSubmission.id}
                      orgId={orgId}
                    />
                  );
                },
                width: 400,
              });
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              height: '100%',
              textDecoration: 'none',
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
          </Link>
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

  const exportApi = useRef<UseChartProExportPublicApi>();

  return (
    <ResponseStatsCard
      exportApi={exportApi}
      exportDisabled={tab === 'responses'}
      onTabChange={(selected) => setTab(selected)}
      questionStats={questionStats}
      subheader={subheader}
      tabOptions={[
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
      tabValue={tab}
    >
      <Box height={CHART_HEIGHT} width={'100%'}>
        {tab === 'word-cloud' && (
          <TextResponseWordCloud
            exportApi={exportApi}
            questionStats={questionStats}
          />
        )}
        {tab === 'word-frequency-bars' && (
          <QuestionStatsBarPlot
            exportApi={exportApi}
            questionStats={questionStats}
          />
        )}
        {tab === 'responses' && (
          <TextResponseList
            questionStats={questionStats}
            submissionStats={submissionStats}
          />
        )}
      </Box>
    </ResponseStatsCard>
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
