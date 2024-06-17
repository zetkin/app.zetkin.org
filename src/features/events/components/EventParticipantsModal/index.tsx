import { Box, Card } from '@mui/material';
import { FC, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import ParticipantsList from './ParticipantsList';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useParticipantPool from 'features/events/hooks/useParticipantPool';
import useSelectedEvents from 'features/events/hooks/useSelectedEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIPersonHoverCard from 'zui/ZUIPersonHoverCard';
import ZUISubmitCancelButtons from 'zui/ZUISubmitCancelButtons';

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

  return (
    <ZUIDialog
      maxWidth="lg"
      onClose={() => onClose()}
      open={open}
      title={messages.participantsModal.title()}
    >
      <Box display="flex" height="60vh">
        <Box flex={1} sx={{ overflowY: 'auto' }}>
          {events.map((event) => (
            <Box key={event.id} onClick={() => setSelectedEvent(event)}>
              {event.title || event.activity?.title}
            </Box>
          ))}
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
      {affectedParticipantIds.length > 0 && (
        <Card elevation={0}>
          <Box display="flex" flexWrap="wrap" gap={0.5} p={1}>
            {affectedParticipantIds.map((id) => (
              <ZUIPersonHoverCard key={id} personId={id}>
                <ZUIAvatar
                  size={'sm'}
                  url={`/api/orgs/${orgId}/people/${id}/avatar`}
                />
              </ZUIPersonHoverCard>
            ))}
          </Box>
        </Card>
      )}
      <ZUISubmitCancelButtons onCancel={() => onClose()} />
    </ZUIDialog>
  );
};

export default EventParticipantsModal;
