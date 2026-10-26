import { Box, Button, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { FC } from 'react';

import { Msg } from 'core/i18n';
import messageIds from 'features/canvass/l10n/messageIds';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { HouseholdItem } from './types';
import HouseholdSquare from './HouseholdSquare';
import { MetricIcon } from 'features/canvass/components/MetricIcon';

type Props = {
  delay: number;
  expanded: boolean;
  item: HouseholdItem;
  onClick: () => void;
  onClickDetails: () => void;
  onClickVisit: () => void;
  selectionMode: 'default' | 'selected' | 'unselected';
};

const HouseholdStackItem: FC<Props> = ({
  delay,
  expanded,
  item,
  onClick,
  onClickDetails,
  onClickVisit,
  selectionMode,
}) => {
  const {
    household,
    lastVisitMetrics,
    lastVisitSuccess,
    lastVisitTime,
    metrics,
  } = item;

  return (
    <Box
      onClick={() => onClick()}
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 1,
      }}
    >
      <HouseholdSquare
        active={selectionMode == 'selected' || selectionMode == 'default'}
        color={item.household.color}
        content={lastVisitSuccess ? 'check' : lastVisitTime ? 'cross' : null}
      />
      {expanded && (
        <Box
          onClick={(ev) => {
            ev.stopPropagation();
            onClickDetails();
          }}
          sx={{
            '@keyframes enter': {
              from: {
                opacity: 0,
              },
              to: {
                opacity: 1,
              },
            },
            alignItems: 'center',
            animationDelay: delay + 's',
            animationDuration: '0.2s',
            animationFillMode: 'backwards',
            animationName: 'enter',
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <Typography variant="body1">{household.title}</Typography>
            <Box
              alignItems="center"
              display="flex"
              gap={1}
              sx={{
                alignContent: 'flex-start',
                columnGap: 1,
                flexWrap: 'wrap',
                height: lastVisitTime ? '1.4rem' : 0,
                rowGap: 0,
              }}
            >
              {!!lastVisitMetrics && (
                <Box display="flex" flexShrink="0" gap={0.2}>
                  {metrics.map((metric, i) => {
                    const lastVisitMetric = lastVisitMetrics.find(
                      (metricResponse) => metric.id === metricResponse.metric_id
                    );
                    return (
                      <MetricIcon
                        key={metric.id}
                        first={i === 0}
                        last={i === metrics.length - 1}
                        metric={metric}
                        response={lastVisitMetric?.response ?? null}
                        variant={'small'}
                      />
                    );
                  })}
                </Box>
              )}
              {!!lastVisitTime && (
                <Typography
                  color="secondary"
                  flexShrink="0"
                  variant="body2"
                  whiteSpace="nowrap"
                >
                  <ZUIRelativeTime
                    datetime={addOffsetIfNecessary(lastVisitTime)}
                  />
                </Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              paddingRight: 1,
            }}
          >
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                onClickDetails();
              }}
            >
              <InfoIcon />
            </Button>
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                onClickVisit();
              }}
              variant="outlined"
            >
              <Msg id={messageIds.households.stackItem.visitButtonLabel} />
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

function addOffsetIfNecessary(originalTimestamp: string): string {
  return originalTimestamp.includes('Z')
    ? originalTimestamp
    : originalTimestamp.concat('Z');
}

export default HouseholdStackItem;
