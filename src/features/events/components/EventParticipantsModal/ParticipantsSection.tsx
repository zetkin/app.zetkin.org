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
    <Box>
      <Typography variant="h5">
        <Msg
          id={messageIds.participantsModal.participantsList.headers.booked}
        />
      </Typography>
      <ParticipantsList
        eventId={event.id}
        orgId={event.organization.id}
        participants={bookedParticipants}
      />

      <Typography variant="h5">
        <Msg
          id={messageIds.participantsModal.participantsList.headers.pending}
        />
      </Typography>
      <ParticipantsList
        eventId={event.id}
        orgId={event.organization.id}
        participants={pendingParticipants}
      />
    </Box>
  );
};

export default ParticipantsSection;
