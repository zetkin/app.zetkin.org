import React, {
  CSSProperties,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Tooltip } from '@mui/material';
import { Wordcloud } from '@visx/wordcloud';
import {
  useChartProExport,
  UseChartProExportSignature,
} from '@mui/x-charts-pro';
import { ChartPluginOptions } from '@mui/x-charts/internals';
import { scaleLog } from 'd3-scale';

import useResizeObserver from 'zui/hooks/useResizeObserver';
import { Zetkin2TextQuestionStats } from 'features/surveys/types';
import {
  CHART_HEIGHT,
  ChartWrapper,
  COLORS,
  UseChartProExportPublicApi,
} from './InsightsCard';
import {
  NLPAnalysisType,
  useFrequencyData,
} from 'features/surveys/hooks/useSurveyFrequencyData';
import { makeDeterministicRNG } from 'utils/randomUtils';

interface WordData {
  text: string;
  value: number;
}
const WordCloudFixedValueGenerator = () => 0.5;

const wordCloudTextStyle: CSSProperties = {
  transition: 'transform 200ms ease',
};

export const TextWordCloudPlot = ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
