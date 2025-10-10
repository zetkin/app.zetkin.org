import { Box, Button, Typography } from '@mui/material';
import { FC } from 'react';

import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { HouseholdItem } from './types';
import HouseholdSquare from './HouseholdSquare';

type Props = {
  delay: number;
  expanded: boolean;
  item: HouseholdItem;
  onClick: () => void;
  onClickVisit: () => void;
  selectionMode: 'default' | 'selected' | 'unselected';
};

const HouseholdStackItem: FC<Props> = ({
  delay,
  expanded,
  item,
  onClick,
  onClickVisit,
  selectionMode,
}) => {
  const { household, lastVisitSuccess, lastVisitTime } = item;

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
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="body1">{household.title}</Typography>
            <Box alignItems="center" display="flex" gap={0.5}>
              {!!lastVisitTime && (
                <Typography color="secondary" variant="body2">
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
              gap: 1,
            }}
          >
            <Button
              onClick={(ev) => {
                ev.stopPropagation();
                onClickVisit();
              }}
              variant="outlined"
            >
              Visit
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
