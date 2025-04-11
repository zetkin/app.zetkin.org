import { Box } from '@mui/material';
import { FC } from 'react';
import { makeStyles } from '@mui/styles';

import { Msg } from 'core/i18n';
import { EventState } from '../hooks/useEventState';
import messageIds from '../l10n/messageIds';
import oldTheme from 'theme';

interface EventStatusChipProps {
  state: EventState;
}

const useStyles = makeStyles(() => ({
  cancelled: {
    backgroundColor: oldTheme.palette.statusColors.orange,
  },
  chip: {
    alignItems: 'center',
    borderRadius: '2em',
    color: 'white',
    display: 'inline-flex',
    fontSize: 14,
    fontWeight: 'bold',
    padding: '0.5em 0.7em',
  },
  draft: {
    backgroundColor: oldTheme.palette.grey[500],
  },
  ended: {
    backgroundColor: oldTheme.palette.error.main,
  },
  open: {
    backgroundColor: oldTheme.palette.success.main,
  },
  scheduled: {
    backgroundColor: oldTheme.palette.statusColors.blue,
  },
}));

const EventStatusChip: FC<EventStatusChipProps> = ({ state }) => {
  const classes = useStyles();

  if (state == EventState.UNKNOWN) {
    return null;
  }

  const classMap: Record<EventState, string> = {
    [EventState.ENDED]: classes.ended,
    [EventState.DRAFT]: classes.draft,
    [EventState.OPEN]: classes.open,
    [EventState.SCHEDULED]: classes.scheduled,
    [EventState.CANCELLED]: classes.cancelled,
    [EventState.UNKNOWN]: classes.draft,
  };

  const colorClassName = classMap[state];

  return (
    <Box className={`${colorClassName} ${classes.chip}`}>
      <Msg id={messageIds.state[state]} />
    </Box>
  );
};

export default EventStatusChip;
