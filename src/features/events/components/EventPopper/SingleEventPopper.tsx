import { FC } from 'react';
import { Box, Paper, Popper } from '@mui/material';

import EventPopperHeader from './EventPopperHeader';
import { EventState } from 'features/events/models/EventDataModel';
import SingleEvent from './SingleEvent';
import {
  ZetkinEvent,
  ZetkinEventParticipant,
  ZetkinEventResponse,
} from 'utils/types/zetkin';

interface SingleEventPopperProps {
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

const SingleEventPopper: FC<SingleEventPopperProps> = ({
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

export default SingleEventPopper;
