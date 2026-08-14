import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { ZetkinMetric } from 'features/areaAssignments/types';
import { HouseholdVisit } from 'features/canvass/hooks/useVisitReporting';
import { Msg } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { MetricIcon } from 'features/canvass/components/MetricIcon';

type Props = {
  metrics: ZetkinMetric[];
  visit: HouseholdVisit;
};

export const VisitDetails: FC<Props> = ({ metrics, visit }) => {
  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Typography variant="headingLg">
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
            <Box
              key={metric.id}
              alignItems="center"
              display="flex"
              flexDirection="row"
              gap={1}
            >
              <Box flexShrink={0} width={'30px'}>
                <MetricIcon
                  metric={metric}
                  response={response?.response ?? null}
                  size={'medium'}
                />
              </Box>
              <Box display="flex" flexDirection="column">
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
                <Typography fontWeight="bold" variant="body2">
                  {response ? (
                    response.response
                  ) : (
                    <Msg id={messageIds.households.single.notAnswered} />
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
