import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import { ZetkinCallTarget } from '../types';
import useEventCallActions from '../hooks/useEventCallActions';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import { useAppSelector } from 'core/hooks';
import messageIds from '../l10n/messageIds';
import { Msg } from 'core/i18n';

interface TargetEventProps {
  event: ZetkinEvent;
  target: ZetkinCallTarget;
}

const TargetEvent: FC<TargetEventProps> = ({ event, target }) => {
  const { signUp, undoSignup } = useEventCallActions(
    event.organization.id,
    event.id,
    target.id
  );

  const targetIsBooked = target.future_actions.some(
    (futureEvent) => futureEvent.id === event.id
  );
  const eventList = useAppSelector(
    (state) => state.call.eventsByTargetId[target.id].items || []
  );

  const isSignup = eventList.some(
    (eventInList) =>
      eventInList.data?.status == 'signedUp' && eventInList.data.id == event.id
  );

  return (
    <Box m={2}>
      <Typography variant="h6">{event.title || 'Untitled event'}</Typography>
      <ZUITimeSpan
        end={new Date(removeOffset(event.end_time))}
        start={new Date(removeOffset(event.start_time))}
      />
      <Box mt={1}>
        {targetIsBooked ? (
          <Typography variant="body2">
            <Msg
              id={messageIds.activeEvents.alreadyBooked}
              values={{ name: target.first_name }}
            />
          </Typography>
        ) : (
          <Box>
            {isSignup ? (
              <Button onClick={undoSignup} size="small" variant="outlined">
                <Msg id={messageIds.activeEvents.undoSignUp} />
              </Button>
            ) : (
              <Button onClick={signUp} size="small" variant="contained">
                <Msg id={messageIds.activeEvents.signUp} />
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TargetEvent;
