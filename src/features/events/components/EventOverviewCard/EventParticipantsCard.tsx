import { Box, Typography } from '@mui/material';
import { FC, useState } from 'react';

import EventDataModel from 'features/events/models/EventDataModel';
import messageIds from 'features/events/l10n/messageIds';
import theme from 'theme';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';

type EventParticipantsCardProps = {
  model: EventDataModel;
};

const EventParticipantsCard: FC<EventParticipantsCardProps> = ({ model }) => {
  const eventData = model.getData().data;
  const messages = useMessages(messageIds);

  if (!eventData) {
    return null;
  }

  return (
    <Box>
      <ZUICard header={messages.eventParticipantsCard.header()}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Typography
              color={theme.palette.text.secondary}
              component="h6"
              variant="subtitle1"
            >
              {messages.eventParticipantsCard.pending()}
            </Typography>
          </Box>
          <Box>
            <Typography
              color={theme.palette.text.secondary}
              component="h6"
              variant="subtitle1"
            >
              {messages.eventParticipantsCard.booked()}
            </Typography>
          </Box>
          <Box>
            <Typography
              color={theme.palette.text.secondary}
              component="h6"
              variant="subtitle1"
            >
              {messages.eventParticipantsCard.cancelled()}
            </Typography>
          </Box>
          <Box>
            <Typography
              color={theme.palette.text.secondary}
              component="h6"
              variant="subtitle1"
            >
              {messages.eventParticipantsCard.contact()}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Box>
            <Typography
              color={theme.palette.info.main}
              component="h6"
              variant="subtitle1"
            >
              {messages.eventParticipantsCard.participant_list().toUpperCase()}
            </Typography>
          </Box>
        </Box>
      </ZUICard>
    </Box>
  );
};

export default EventParticipantsCard;
