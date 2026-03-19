import {
  Box,
  Button,
  Divider,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import {
  ChartImageExportOptions,
  ChartPrintExportOptions,
} from '@mui/x-charts-pro';
import DownloadIcon from '@mui/icons-material/Download';
import {
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { BoxOwnProps } from '@mui/system';
import Menu from '@mui/material/Menu';

import { useMessages } from 'core/i18n';
import messageIds from 'features/surveys/l10n/messageIds';
import ZUICard from 'zui/ZUICard';
import { ZetkinSurveyQuestionElement } from 'utils/types/zetkin';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import {
  NLPAnalysisType,
  useSurveyAnalysisTypeSelection,
} from 'features/surveys/hooks/useSurveyAnalysisTypeSelection';
import { sanitizeFileName } from 'utils/stringUtils';

export const TEXT_RESPONSE_CARD_HEIGHT = 150;
export const CHART_HEIGHT = 400;

export const COLORS = [
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

export const InsightsCard = ({
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
    [
      exportApi,
      question.question.question,
      showSnackbar,
      messages.insights.export,
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
    [exportChart, messages.insights.export]
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

export const ChartWrapper = (
  props: BoxOwnProps & {
    typeSelection: ReturnType<typeof useSurveyAnalysisTypeSelection>;
  }
) => {
  const { typeSelection, children, ...other } = props;
  return (
    <Box
      sx={{
        position: 'relative',
      }}
    >
      {typeSelection.hasFreqData && (
        <Box
          sx={{
            left: 0,
            position: 'absolute',
            top: 0,
            zIndex: 10,
          }}
        >
          <Select
            onChange={(e) =>
              typeSelection.setAnalysisType(e.target.value as NLPAnalysisType)
            }
            size={'small'}
            value={typeSelection.analysisType}
            variant={'standard'}
          >
            <MenuItem value={'word-frequency'}>Words</MenuItem>
            <MenuItem value={'verb-frequency'}>Verbs</MenuItem>
            <MenuItem value={'entity-frequency'}>Entities</MenuItem>
          </Select>
        </Box>
      )}
      <Box className={'zetkin-chart-content'} {...other}>
        {children}
      </Box>
    </Box>
  );
};
