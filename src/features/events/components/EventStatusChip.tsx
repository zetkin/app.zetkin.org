import { Box, SxProps } from '@mui/material';
import { FC, useMemo } from 'react';

import { Msg } from 'core/i18n';
import { EventState } from '../hooks/useEventState';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

interface EventStatusChipProps {
  state: EventState;
}

const EventStatusChip: FC<EventStatusChipProps> = ({ state }) => {
  const chipStyles: SxProps = useMemo(() => {
    return {
      alignItems: 'center',
      borderRadius: '2em',
      color: 'white',
      display: 'inline-flex',
      fontSize: 14,
      fontWeight: 'bold',
      padding: '0.5em 0.7em',
      ...{
        [EventState.ENDED]: {
          backgroundColor: oldTheme.palette.error.main,
        },
        [EventState.DRAFT]: {
          backgroundColor: oldTheme.palette.grey[500],
        },
        [EventState.OPEN]: {
          backgroundColor: oldTheme.palette.success.main,
        },
        [EventState.SCHEDULED]: {
          backgroundColor: oldTheme.palette.statusColors.blue,
        },
        [EventState.CANCELLED]: {
          backgroundColor: oldTheme.palette.statusColors.orange,
        },
        [EventState.UNKNOWN]: {
          backgroundColor: oldTheme.palette.grey[500],
        },
      }[state],
    };
  }, [state]);

  if (state == EventState.UNKNOWN) {
    return null;
  }

  return (
    <Box sx={chipStyles}>
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default EventStatusChip;
