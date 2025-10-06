import { Check, Close } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { FC } from 'react';

import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { HouseholdItem } from './types';

type Props = {
  delay: number;
  expanded: boolean;
  item: HouseholdItem;
  onClick: () => void;
};

const HouseholdStackItem: FC<Props> = ({ delay, expanded, item, onClick }) => {
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
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor:
            item.household.color == 'clear' ? '#eee' : item.household.color,
          borderRadius: 1,
          display: 'flex',
          height: 50,
          justifyContent: 'center',
          margin: 0,
          width: 50,
        }}
      >
        {lastVisitSuccess && <Check color="secondary" fontSize="small" />}
        {!!lastVisitTime && !lastVisitSuccess && (
          <Close color="secondary" fontSize="small" />
        )}
      </Box>
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
            animationDelay: delay + 's',
            animationDuration: '0.2s',
            animationFillMode: 'backwards',
            animationName: 'enter',
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
