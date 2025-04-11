import { FC, ReactNode, Suspense } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Fade,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import { ZetkinCallTarget } from '../types';
import useEventCallActions from '../hooks/useEventCallActions';
import MyActivityListItem from 'features/home/components/MyActivityListItem';
import ZUITimeSpan from 'zui/ZUITimeSpan';
import { removeOffset } from 'utils/dateUtils';
import { ZetkinEvent } from 'utils/types/zetkin';
import useAllEvents from 'features/events/hooks/useAllEvents';

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

  const events = useAllEvents();
  const eventWithStatus = events.find((callEvent) => callEvent.id == event.id);

  if (!eventWithStatus) {
    return null;
  }

  const actions: ReactNode[] = [];
  if (eventWithStatus.status == 'booked') {
    actions.push(
      <Typography key="booked" variant="body2">
        Booked
      </Typography>
    );
  } else if (eventWithStatus.status == 'signedUp') {
    actions.push(
      <Button
        key="action"
        onClick={() => undoSignup()}
        size="small"
        variant="outlined"
      >
        Undo-signup
      </Button>,
      <Fade appear in style={{ transitionDelay: '0.3s' }}>
        <Box
          key="signedUp"
          sx={{
            bgcolor: '#C1EEC1',
            borderRadius: 4,
            color: '#080',
            px: 1,
            py: 0.3,
          }}
        >
          <Typography variant="body2">Signed-up</Typography>
        </Box>
      </Fade>
    );
  } else {
    actions.push(
      <Button
        key="action"
        onClick={() => signUp()}
        size="small"
        variant="contained"
      >
        Signup
      </Button>
    );

    if (event.num_participants_available < event.num_participants_required) {
      actions.push(
        <Box
          key="needed"
          sx={{
            bgcolor: '#FFE5C1',
            borderRadius: 4,
            color: '#f40',
            px: 1,
            py: 0.3,
          }}
        >
          <Typography variant="body2">Needed</Typography>
        </Box>
      );
    }
  }
  return (
    <Suspense fallback={<ZUILogoLoadingIndicator />}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>{event.title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box mb={2}>
            <ZUITimeSpan
              end={new Date(removeOffset(event.end_time))}
              start={new Date(removeOffset(event.start_time))}
            />
            <MyActivityListItem
              actions={actions}
              info={[]}
              title={event.title || ''}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </Suspense>
  );
};

export default TargetEvent;
