import { FC } from 'react';
import { Box, Chip, Typography } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';

interface EventParticipansListProps {
  data: ZetkinEvent;
}

const EventParticipansList: FC<EventParticipansListProps> = ({ data }) => {
  const messages = useMessages(messageIds);

  return (
    <Box>
      <Box id={'Sign-up-header'}>
        <Typography variant="h4">
          {messages.eventParticipantsList.signUps()}
        </Typography>
        <Chip
          label={Math.max(
            data.num_participants_required - data.num_participants_available,
            0
          )}
          variant="outlined"
        ></Chip>
      </Box>
      <Box id={'Booked-header'}>
        <Typography variant="h4">
          {messages.eventParticipantsList.bookedParticipants()}
        </Typography>
        <Chip
          color="secondary"
          label={
            data.num_participants_available +
            '/' +
            data.num_participants_required
          }
          variant="outlined"
        ></Chip>
      </Box>
    </Box>
  );
};

export default EventParticipansList;
