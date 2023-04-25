import { Box, Checkbox, Paper, Popper, Typography } from '@mui/material';
import React, { FC } from 'react';

import { EventState } from '../../models/EventDataModel';
import SingleEvent from './SingleEvent';
import StatusDot from './StatusDot';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from '../../../../utils/types/zetkin';

interface EventPopperHeaderParams {
  event: ZetkinEvent;
  state: EventState;
}

function EventPopperHeader({ event, state }: EventPopperHeaderParams) {
  return (
    <>
      <Box alignItems="center" display="flex">
        <Checkbox size="medium" />
        <Typography variant="h5">
          {event.title || event.activity.title}
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" sx={{ ml: 1 }}>
        <StatusDot state={state} />
        <Typography color="secondary" sx={{ ml: 1 }}>
          {event.activity.title}
        </Typography>
      </Box>
    </>
  );
}

interface EventPopperProps {
  anchorEl: HTMLElement | null;
  event: ZetkinEvent;
  onCancel: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  onPublish: () => void;
  open: boolean;
  participants: ZetkinEventParticipant[];
  respondents: ZetkinEventResponse[];
  state: EventState;
}

const EventPopper: FC<EventPopperProps> = ({
  anchorEl,
  event,
  onCancel,
  onDelete,
  onPublish,
  open,
  participants,
  respondents,
  state,
}) => {
  return (
    <Popper anchorEl={anchorEl} open={open} placement="bottom">
      <Paper sx={{ padding: 2, width: '340px' }}>
        <Box display="flex" flexDirection="column">
          <EventPopperHeader event={event} state={state} />
          <SingleEvent
            event={event}
            onCancel={onCancel}
            onDelete={onDelete}
            onPublish={onPublish}
            participants={participants}
            respondents={respondents}
            state={state}
          />
        </Box>
      </Paper>
    </Popper>
  );
};
export default EventPopper;
