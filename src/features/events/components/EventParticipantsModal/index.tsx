import { Box, Button, Card, Typography, useTheme } from '@mui/material';
import { FC, useState } from 'react';

import EventsSection from './EventsSection';
import messageIds from 'features/events/l10n/messageIds';
import ParticipantsSection from './ParticipantsSection';
import { useNumericRouteParams } from 'core/hooks';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import useParticipantPoolApi from 'features/events/hooks/useParticipantPoolApi';
import useSelectedEvents from 'features/events/hooks/useSelectedEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import { Msg, useMessages } from 'core/i18n';

type Props = {
  onClose: () => void;
  open: boolean;
};

const EventParticipantsModal: FC<Props> = ({ onClose, open }) => {
  const { orgId } = useNumericRouteParams();
  const events = useSelectedEvents();
  const messages = useMessages(messageIds);
  const [selectedEvent, setSelectedEvent] = useState<ZetkinEvent | null>(null);
  const { affectedParticipantIds } = useParticipantPool();
  const { discard, execute } = useParticipantPoolApi(orgId);
  const theme = useTheme();

  return (
    <ZUIDialog
      maxWidth="lg"
      onClose={() => onClose()}
      open={open}
      title={messages.participantsModal.title()}
    >
      <Box alignItems="stretch" display="flex" height="60vh">
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          <EventsSection
            events={events}
            onSelect={(event) => setSelectedEvent(event)}
            selectedEvent={selectedEvent}
          />
        </Box>
        <Box
          bgcolor={theme.palette.grey[100]}
          flex={1}
          sx={{ overflowY: 'auto' }}
        >
          {selectedEvent && <ParticipantsSection event={selectedEvent} />}
        </Box>
      </Box>
      <Card elevation={0} sx={{ mt: 1, p: 1 }}>
        <Typography variant="h6">
          <Msg id={messageIds.participantsModal.affected.header} />
        </Typography>
        {!affectedParticipantIds.length && (
          <Typography variant="body2">
            <Msg id={messageIds.participantsModal.affected.empty} />
          </Typography>
        )}
        {!!affectedParticipantIds.length && (
          <Box display="flex" flexWrap="wrap" gap={0.5} my={1}>
            {affectedParticipantIds.map((id) => (
              <ZUIPersonHoverCard key={id} personId={id}>
                <ZUIAvatar
                  size={'sm'}
                  url={`/api/orgs/${orgId}/people/${id}/avatar`}
                />
              </ZUIPersonHoverCard>
            ))}
          </Box>
        )}
      </Card>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="flex-end"
        paddingTop={1}
      >
        <Box alignItems="center" display="flex" justifyContent="flex-end">
          {!!affectedParticipantIds.length && (
            <Typography color="secondary">
              <Msg
                id={messageIds.participantsModal.statusText}
                values={{ personCount: affectedParticipantIds.length }}
              />
            </Typography>
          )}
          <Button
            onClick={() => {
              discard();
              onClose();
            }}
            sx={{ mx: 1 }}
            variant="text"
          >
            {messages.participantsModal.discardButton()}
          </Button>
          <Button
            disabled={affectedParticipantIds.length == 0}
            onClick={() => {
              execute();
              onClose();
            }}
            sx={{ ml: 1 }}
            variant="contained"
          >
            {messages.participantsModal.submitButton()}
          </Button>
        </Box>
      </Box>
    </ZUIDialog>
  );
};

export default EventParticipantsModal;
