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
  Select,
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
import { scaleLog } from 'd3-scale';
import { BoxOwnProps } from '@mui/system';

import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';
import {
  ELEMENT_TYPE,
  ZetkinSurveyQuestionElement,
  ZetkinSurveySubmission,
} from 'utils/types/zetkin';
import range from 'utils/range';
import useSurveyInsights from 'features/surveys/hooks/useSurveyResponseStats';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import useSurveySubmission from 'features/surveys/hooks/useSurveySubmission';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { useNumericRouteParams } from 'core/hooks';
import { getEllipsedString, sanitizeFileName } from 'utils/stringUtils';
import SurveySubmissionPane from 'features/surveys/panes/SurveySubmissionPane';
import { usePanes } from 'utils/panes';
import useResizeObserver from 'zui/hooks/useResizeObserver';
import ZUIText from 'zui/components/ZUIText';
import { makeDeterministicRNG } from 'utils/randomUtils';
import {
  isOptionsQuestion,
  isOptionsStats,
  isTextResponse,
  isTextStats,
  Zetkin2OptionsQuestionStats,
  Zetkin2QuestionStats,
  Zetkin2TextAnswerListPerQuestion,
  Zetkin2TextQuestionStats,
} from 'features/surveys/types';
import useSurveyElements from 'features/surveys/hooks/useSurveyElements';
import ZUIFutures from 'zui/ZUIFutures';

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

const InsightsCard = ({
  children,
  controls,
  exportApi,
  exportDisabled,
  onTabChange,
  question,
  subheader,
  tabOptions,
  tabValue,
}: {
  children: ReactNode;
  controls?: ReactNode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  exportDisabled: boolean;
  onTabChange: (tab: string) => void;
  question: ZetkinSurveyQuestionElement;
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
            fileName: sanitizeFileName(question.question.question),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [showSnackbar, containerRef, exportApi, question.question.question]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      header={question.question.question}
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
          {controls}
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

const ChartWrapper = (
  props: BoxOwnProps & {
    analysisType: NLPAnalysisType;
    setAnalysisType: (typ: NLPAnalysisType) => void;
  }
) => {
  const { analysisType, setAnalysisType, children, ...other } = props;
  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          left: 0,
          position: 'absolute',
          top: 0,
          zIndex: 10,
        }}
      >
        <Select
          onChange={(e) => setAnalysisType(e.target.value as NLPAnalysisType)}
          size={'small'}
          value={analysisType}
          variant={'standard'}
        >
          <MenuItem value={'word-frequency'}>Words</MenuItem>
          <MenuItem value={'verb-frequency'}>Verbs</MenuItem>
          <MenuItem value={'entity-frequency'}>Entities</MenuItem>
        </Select>
      </Box>
      <Box className={'zetkin-chart-content'} {...other}>
        {children}
      </Box>
    </Box>
  );
};

type NLPAnalysisType = 'word-frequency' | 'verb-frequency' | 'entity-frequency';

const useFrequencyData = (
  questionStats: Zetkin2QuestionStats,
  analysisType: NLPAnalysisType
): Record<string, number> => {
  return useMemo(() => {
    if (!isTextStats(questionStats)) {
      return {};
    }

    if (analysisType === 'verb-frequency') {
      return questionStats.top_verb_frequencies;
    } else if (analysisType === 'entity-frequency') {
      return questionStats.top_entity_frequencies;
    }
    return questionStats.top_word_frequencies;
  }, [questionStats, analysisType]);
};

const getOptionText = (
  question: ZetkinSurveyQuestionElement,
  optionId: number
) => {
  if (!('options' in question.question) || !question.question.options) {
    return '';
  }

  const option = question.question.options.find(
    (option) => option.id === optionId
  );
  if (!option) {
    return '';
  }

  return option.text;
};

type DisplayMode = 'absolute' | 'percent';

const QuestionStatsBarPlot = ({
  displayMode,
  exportApi,
  question,
  questionStats,
}: {
  displayMode: DisplayMode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2QuestionStats;
}) => {
  const [analysisType, setAnalysisType] =
    useState<NLPAnalysisType>('word-frequency');

  const freqData = useFrequencyData(questionStats, analysisType);

  const theme = useTheme();
  const isOptions = isOptionsStats(questionStats);
  const percentBase = isOptions
    ? questionStats.total_selected_options_count || questionStats.answer_count
    : 0;
  const percentFormatter = (value: number | null) =>
    value == null ? '' : `${value}%`;
  const absoluteFormatter = (value: number | null) =>
    value == null ? '' : value.toString();
  const showPercent = isOptions && displayMode === 'percent';
  const valueFormatter = showPercent ? percentFormatter : absoluteFormatter;

  const data = useMemo(() => {
    const bars = isOptionsStats(questionStats)
      ? (isOptionsQuestion(question.question)
          ? question.question.options || []
          : []
        ).map((o) => {
          let count =
            questionStats.options.find((c) => c.option_id === o.id)?.count || 0;

          if (showPercent) {
            if (percentBase) {
              count = Math.round((count / percentBase) * 100);
            } else {
              count = 0;
            }
          }

          return {
            count,
            option: getOptionText(question, o.id),
          };
        })
      : Object.entries(freqData).map(([word, count]) => ({
          count: count,
          option: word,
        }));
    let sorted = bars.sort((a, b) => b.count - a.count);
    if (isTextStats(questionStats)) {
      sorted = sorted.slice(0, 10);
    }
    return sorted;
  }, [questionStats, question, freqData, showPercent, percentBase]);

  return (
    <ChartWrapper analysisType={analysisType} setAnalysisType={setAnalysisType}>
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
            valueFormatter,
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
            valueFormatter,
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
  displayMode,
  exportApi,
  question,
  questionStats,
}: {
  displayMode: DisplayMode;
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2QuestionStats;
}) => {
  const isOptions = isOptionsStats(questionStats);
  const percentBase = isOptions
    ? questionStats.total_selected_options_count || questionStats.answer_count
    : 0;
  const pieArcLabelFormatter = (
    item: { value: number } & Record<string, unknown>
  ) => `${item.value}%`;
  const showPercent = isOptions && displayMode === 'percent';
  const pieValueFormatter = (
    value: number | { value: number } | null
  ): string => {
    if (value == null) {
      return '';
    }

    const numericValue = typeof value === 'number' ? value : value.value;
    return showPercent ? `${numericValue}%` : numericValue.toString();
  };
  const [analysisType, setAnalysisType] =
    useState<NLPAnalysisType>('word-frequency');

  const freqData = useFrequencyData(questionStats, analysisType);

  const data = useMemo(() => {
    const items = isOptionsStats(questionStats)
      ? (isOptionsQuestion(question.question)
          ? question.question.options || []
          : []
        ).map((o) => {
          let value =
            questionStats.options.find((c) => c.option_id === o.id)?.count || 0;

          if (showPercent) {
            if (percentBase) {
              value = Math.round((value / percentBase) * 100);
            } else {
              value = 0;
            }
          }

          return {
            label: getEllipsedString(getOptionText(question, o.id), 60),
            value,
          };
        })
      : Object.entries(freqData).map(([word, count]) => ({
          label: getEllipsedString(word, 60),
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
  }, [questionStats, question, freqData, showPercent, percentBase]);
  const messages = useMessages(messageIds);
  const [hasSeenPieInaccuracyWarning, setHasSeenPieInaccuracyWarning] =
    useState(false);

  return (
    <>
      {isOptionsStats(questionStats) &&
        !!questionStats.multiple_selected_options_count && (
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
                  respondentCount:
                    questionStats.multiple_selected_options_count,
                }
              )}
            </Alert>
          </Collapse>
        )}
      <ChartWrapper
        analysisType={analysisType}
        setAnalysisType={setAnalysisType}
      >
        <PieChartPro
          apiRef={
            exportApi as unknown as MutableRefObject<UseChartProExportPublicApi>
          }
          height={CHART_HEIGHT}
          series={[
            {
              arcLabel: showPercent ? pieArcLabelFormatter : 'value',
              cornerRadius: 5,
              data,
              innerRadius: 80,
              outerRadius: 180,
              valueFormatter: pieValueFormatter,
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
  question,
  questionStats,
}: {
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2OptionsQuestionStats;
}) => {
  const [tab, setTab] = useState('bar-plot');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('percent');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.optionsFields.subheader({
        answerCount: questionStats.answer_count,
        totalSelectedOptionsCount: questionStats.total_selected_options_count,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionStats, messages.insights.optionsFields.subheader]
  );

  const exportApi = useRef<UseChartProExportPublicApi>();
  const displayToggle = (
    <ToggleButtonGroup
      exclusive
      onChange={(_, newValue) => newValue && setDisplayMode(newValue)}
      orientation={'horizontal'}
      size={'small'}
      value={displayMode}
    >
      <ToggleButton size={'small'} value={'absolute'}>
        <Msg
          id={messageIds.insights.optionsFields.displayInsights.absoluteCount}
        />
      </ToggleButton>
      <ToggleButton size={'small'} value={'percent'}>
        <Msg
          id={messageIds.insights.optionsFields.displayInsights.percentCount}
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <InsightsCard
      controls={displayToggle}
      exportApi={exportApi}
      exportDisabled={false}
      onTabChange={(selected) => setTab(selected)}
      question={question}
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
          displayMode={displayMode}
          exportApi={exportApi}
          question={question}
          questionStats={questionStats}
        />
      )}
      {tab === 'pie-chart' && (
        <QuestionStatsPie
          displayMode={displayMode}
          exportApi={exportApi}
          question={question}
          questionStats={questionStats}
        />
      )}
    </InsightsCard>
  );
};

interface WordData {
  text: string;
  value: number;
}
const WordCloudFixedValueGenerator = () => 0.5;
const wordCloudTextStyle: CSSProperties = {
  transition: 'transform 200ms ease',
};

const TextResponseWordCloud = ({
  exportApi,
  questionStats,
}: {
  exportApi: MutableRefObject<UseChartProExportPublicApi | undefined>;
  questionStats: Zetkin2TextQuestionStats;
}) => {
  const [analysisType, setAnalysisType] =
    useState<NLPAnalysisType>('word-frequency');

  const srcData = useFrequencyData(questionStats, analysisType);

  const words: WordData[] = useMemo(() => {
    return Object.entries(srcData).map(([word, frequency]) => ({
      text: word,
      value: frequency,
    }));
  }, [srcData]);

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
      }) as ChartPluginOptions<UseChartProExportSignature>,
    []
  );

  const { publicAPI } = useChartProExport(exportOptions);
  useEffect(() => {
    exportApi.current = publicAPI as UseChartProExportPublicApi;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <ChartWrapper
          analysisType={analysisType}
          setAnalysisType={setAnalysisType}
          sx={{ height: '100%', width: '100%' }}
        >
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
                    title={w.text && `${w.text}: ${srcData[w.text]}`}
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
  submissionId,
}: {
  questionId: number;
  submissionId: number;
}) => {
  const { orgId } = useNumericRouteParams();
  const extendedSubmissionFuture = useSurveySubmission(orgId, submissionId);
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

        const submission = extendedSubmission.responses.find(
          (response) => response.question_id === questionId
        );

        if (!submission || !isTextResponse(submission)) {
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
                  {submission.response}
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
  rows: number[][];
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
      {row.map((submissionId, colIndex) => {
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
              questionId={questionId}
              submissionId={submissionId}
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
  questionStats,
  responseStats,
}: {
  questionStats: Zetkin2TextQuestionStats;
  responseStats: Zetkin2TextAnswerListPerQuestion;
}) => {
  const theme = useTheme();
  const singleColumnLayout = useMediaQuery(theme.breakpoints.down('lg'));

  const columnCount = singleColumnLayout ? 1 : 2;

  const rows = useMemo(
    () =>
      chunk(responseStats[questionStats.question_id.toString()], columnCount),
    [responseStats, columnCount, questionStats.question_id]
  );

  const rowProps = useMemo(
    () => ({
      columnCount,
      questionId: questionStats.question_id,
      rows,
    }),
    [columnCount, questionStats.question_id, rows]
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
    />
  );
};

const TextStatsCard = ({
  question,
  questionStats,
  responseStats,
}: {
  question: ZetkinSurveyQuestionElement;
  questionStats: Zetkin2TextQuestionStats;
  responseStats: Zetkin2TextAnswerListPerQuestion;
}) => {
  const [tab, setTab] = useState('word-cloud');
  const messages = useMessages(messageIds);

  const subheader = useMemo(
    () =>
      messages.insights.textFields.subheader({
        answerCount: questionStats.answer_count,
        totalUniqueWordCount: questionStats.total_unique_word_count,
        totalWordCount: questionStats.total_word_count,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionStats, messages.insights.textFields.subheader]
  );

  const exportApi = useRef<UseChartProExportPublicApi>();

  return (
    <InsightsCard
      exportApi={exportApi}
      exportDisabled={tab === 'responses'}
      onTabChange={(selected) => setTab(selected)}
      question={question}
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
            displayMode="absolute"
            exportApi={exportApi}
            question={question}
            questionStats={questionStats}
          />
        )}
        {tab === 'responses' && (
          <TextResponseList
            questionStats={questionStats}
            responseStats={responseStats}
          />
        )}
      </Box>
    </InsightsCard>
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
  const insightsFuture = useSurveyInsights(orgId, surveyId);
  const elementsFuture = useSurveyElements(orgId, surveyId);
  const messages = useMessages(messageIds);

  if (insightsFuture.error || elementsFuture.error) {
    return <ZUIText variant="headingMd">{messages.insights.error()}</ZUIText>;
  }

  return (
    <ZUIFutures
      futures={{ elements: elementsFuture, insights: insightsFuture }}
      loadingIndicator={
        <>
          {range(3).map((_, index) => (
            <LoadingStatsCard key={index} />
          ))}
        </>
      }
    >
      {({ data: { elements, insights } }) => (
        <>
          {insights.questions.map((questionStats, index) => {
            const question = elements.find(
              (question) => question.id === questionStats.question_id
            );
            if (!question || question.type === ELEMENT_TYPE.TEXT) {
              return null;
            }

            return 'options' in questionStats ? (
              <OptionsStatsCard
                key={index}
                question={question}
                questionStats={questionStats}
              />
            ) : (
              <TextStatsCard
                key={index}
                question={question}
                questionStats={questionStats}
                responseStats={insights.response_stats}
              />
            );
          })}
        </>
      )}
    </ZUIFutures>
  );
};

export default ResponseStatsCards;
