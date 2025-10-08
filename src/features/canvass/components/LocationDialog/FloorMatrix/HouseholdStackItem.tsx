import { Check, Close, Edit } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { FC } from 'react';

import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import { HouseholdItem } from './types';

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

  const defaultColor = 'black';
  const color =
    item.household.color == 'clear' ? defaultColor : item.household.color;

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
            selectionMode == 'selected' || selectionMode == 'unselected'
              ? `rgba(from ${color} r g b /${
                  selectionMode == 'selected' ? '1.0' : '0.1'
                })`
              : color,
          borderColor: color,
          borderRadius: 1,
          borderStyle: 'solid',
          borderWidth: 2,
          display: 'flex',
          height: 50,
          justifyContent: 'center',
          margin: 0,
          width: 50,
        }}
      >
        {lastVisitSuccess && (
          <Check
            fontSize="small"
            sx={{ color: selectionMode == 'unselected' ? color : 'white' }}
          />
        )}
        {!!lastVisitTime && !lastVisitSuccess && (
          <Close
            fontSize="small"
            sx={{ color: selectionMode == 'unselected' ? color : 'white' }}
          />
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
            <IconButton>
              <Edit />
            </IconButton>
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
