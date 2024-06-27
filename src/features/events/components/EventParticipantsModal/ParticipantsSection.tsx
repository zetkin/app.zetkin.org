import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { Msg } from 'core/i18n';
import ParticipantsList from './ParticipantsList';
import useEventParticipantsWithChanges from 'features/events/hooks/useEventParticipantsWithChanges';
import { ZetkinEvent } from 'utils/types/zetkin';

type Props = {
  event: ZetkinEvent;
};

const ParticipantsSection: FC<Props> = ({ event }) => {
  const { bookedParticipants, pendingParticipants } =
    useEventParticipantsWithChanges(event.organization.id, event.id);

  return (
    <Box p={2}>
      <Box mb={4}>
        <Typography variant="h5">
          <Msg id={messageIds.participantsModal.participants.headers.booked} />
        </Typography>
        {!bookedParticipants.length && (
          <Typography>
            <Msg id={messageIds.participantsModal.emptyStates.booked} />
          </Typography>
        )}
        {!!bookedParticipants.length && (
          <ParticipantsList
            eventId={event.id}
            orgId={event.organization.id}
            participants={bookedParticipants}
          />
        )}
      </Box>

      <Box mb={4}>
        <Typography variant="h5">
          <Msg id={messageIds.participantsModal.participants.headers.pending} />
        </Typography>
        {!pendingParticipants.length && (
          <Typography>
            <Msg id={messageIds.participantsModal.emptyStates.pending} />
          </Typography>
        )}
        {!!pendingParticipants.length && (
          <ParticipantsList
            eventId={event.id}
            orgId={event.organization.id}
            participants={pendingParticipants}
          />
        )}
      </Box>
    </Box>
  );
};

export default ParticipantsSection;
