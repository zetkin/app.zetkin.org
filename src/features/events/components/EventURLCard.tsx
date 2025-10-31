import { Box } from '@mui/material';
import { useMemo } from 'react';

import useMessages from 'core/i18n/useMessages';
import messageIds from '../l10n/messageIds';
import useEvent from '../hooks/useEvent';
import ZUIURLCard from 'zui/components/ZUIURLCard';

interface EventURLCardProps {
  isOpen: boolean;
  orgId: number;
  eventId: number;
}

const EventURLCard = ({
  isOpen,
  orgId,
  eventId: eventId,
}: EventURLCardProps) => {
  const event = useEvent(orgId, eventId);
  const messages = useMessages(messageIds);
  const eventUrl = useMemo(
    () =>
      event != null && event.data
        ? `${location.protocol}//${location.host}/o/${event.data.organization.id}/events/${eventId}`
        : '',
    [event?.data, eventId]
  );

  return (
    <Box mt={2}>
      <ZUIURLCard
        absoluteUrl={eventUrl}
        isOpen={isOpen}
        messages={messages.urlCard}
        relativeUrl={`/o/${orgId}/events/${eventId}`}
      />
    </Box>
  );
};

export default EventURLCard;
