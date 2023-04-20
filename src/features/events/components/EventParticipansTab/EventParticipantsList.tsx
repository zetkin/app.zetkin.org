import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUINumberChip from 'zui/ZUINumberChip';

interface EventParticipansListProps {
  data: ZetkinEvent;
  model: EventDataModel;
}

const EventParticipansList: FC<EventParticipansListProps> = ({
  data,
  model,
}) => {
  const messages = useMessages(messageIds);

  return (
    <Box>
      {model.getSignedParticipants() < 1 && (
        <Box
          id={'Sign-up-header'}
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Typography mr={2} variant="h4">
            {messages.eventParticipantsList.signUps()}
          </Typography>
          <ZUINumberChip
            color={theme.palette.grey[200]}
            outlined={true}
            value={model.getSignedParticipants()}
          />
          <Typography variant="body1">{''}</Typography>
        </Box>
      )}

      <Box
        id={'Booked-header'}
        style={{ alignItems: 'center', display: 'flex', flexDirection: 'row' }}
      >
        <Typography mr={2} variant="h4">
          {messages.eventParticipantsList.bookedParticipants()}
        </Typography>
        <ZUINumberChip
          color={model.getParticipantStatus(
            data.num_participants_available,
            data.num_participants_required
          )}
          outlined={true}
          value={
            model.getAvailParticipants() + '/' + data.num_participants_required
          }
        />
      </Box>
      <Typography variant="body1">
        {messages.eventParticipantsList.descriptionBooked()}
      </Typography>
    </Box>
  );
};

export default EventParticipansList;
