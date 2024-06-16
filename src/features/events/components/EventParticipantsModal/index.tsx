import { Box } from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import ParticipantsList from './ParticipantsList';
import { useMessages } from 'core/i18n';
import useSelectedEvents from 'features/events/hooks/useSelectedEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIDialog from 'zui/ZUIDialog';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

type Props = {
  onClose: () => void;
  open: boolean;
};

const EventParticipantsModal: FC<Props> = ({ onClose, open }) => {
  const events = useSelectedEvents();
  const messages = useMessages(messageIds);
  const [selectedEvent, setSelectedEvent] = useState<ZetkinEvent | null>(null);

  return (
    <ZUIDialog
      maxWidth="lg"
      onClose={() => onClose()}
      open={open}
      title={messages.participantsModal.title()}
    >
      <Box display="flex" height="60vh">
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          <ul>
            {events.map((event) => (
              <Box key={event.id} onClick={() => setSelectedEvent(event)}>
                {event.title || event.activity?.title}
              </Box>
            ))}
          </ul>
        </Box>
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          {selectedEvent && (
            <ParticipantsList
              eventId={selectedEvent.id}
              orgId={selectedEvent.organization.id}
            />
          )}
        </Box>
      </Box>
      <ZUISubmitCancelButtons onCancel={() => onClose()} />
    </ZUIDialog>
  );
};

export default EventParticipantsModal;
