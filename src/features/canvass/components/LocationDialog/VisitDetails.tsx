import { FC } from 'react';
import { Box, Typography, useTheme } from '@mui/material';

import { ZetkinMetric } from 'features/areaAssignments/types';
import { HouseholdVisit } from 'features/canvass/hooks/useVisitReporting';
import { Msg } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import {
  METRIC_ICON_LARGE_SIZE,
  MetricIcon,
} from 'features/canvass/components/MetricIcon';

type Props = {
  metrics: ZetkinMetric[];
  visit: HouseholdVisit;
};

const METRIC_ICON_COLUMN_WIDTH = 50; // px
const METRIC_ICON_COLUMN_LINE_WIDTH = 2; // px
const METRIC_ICON_COLUMN_LINE_OFFSET =
  (METRIC_ICON_LARGE_SIZE - METRIC_ICON_COLUMN_LINE_WIDTH) / 2; // px

export const VisitDetails: FC<Props> = ({ metrics, visit }) => {
  const theme = useTheme();

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography fontWeight="bold" variant="headingLg">
          <Msg id={messageIds.households.single.visit} />
        </Typography>
        <Typography color="secondary" variant="body2">
          <ZUIRelativeTime datetime={addOffsetIfNecessary(visit.created)} />
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        {metrics.map((metric) => {
          const response = visit.metrics.find(
            (response) => response.metric_id === metric.id
          );

          return (
            <Box key={metric.id} display="flex" flexDirection="column">
              <Box display="flex" flexDirection="row">
                <Box
                  display="flex"
                  flexDirection="column"
                  flexShrink={0}
                  width={`${METRIC_ICON_COLUMN_WIDTH}px`}
                >
                  <MetricIcon
                    metric={metric}
                    response={response?.response ?? null}
                    variant={'large'}
                  />
                </Box>
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  gap={1}
                >
                  <Typography
                    sx={{
                      textWrap: 'break-word',
                    }}
                  >
                    {metric.question}
                  </Typography>
                  {metric.defines_success && (
                    <Typography color="secondary" variant="body2">
                      (<Msg id={messageIds.households.single.definesSuccess} />)
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box display="flex" flexDirection="row">
                <Box
                  display="flex"
                  flexDirection="column"
                  flexShrink={0}
                  width={`${METRIC_ICON_COLUMN_WIDTH}px`}
                >
                  <Box
                    flexGrow={1}
                    marginLeft={`${METRIC_ICON_COLUMN_LINE_OFFSET}px`}
                    marginTop={'5px'}
                    sx={{ backgroundColor: theme.palette.grey[300] }}
                    width={`${METRIC_ICON_COLUMN_LINE_WIDTH}px`}
                  />
                </Box>
                <Typography fontWeight="bold" variant="body2">
                  {response ? (
                    response.response
                  ) : (
                    <Msg id={messageIds.households.single.skipped} />
                  )}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

function addOffsetIfNecessary(originalTimestamp: string): string {
  return originalTimestamp.includes('Z')
    ? originalTimestamp
    : originalTimestamp.concat('Z');
}
