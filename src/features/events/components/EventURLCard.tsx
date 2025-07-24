import { OpenInNew } from '@mui/icons-material';
import { useMemo } from 'react';
import { Box, Link, useTheme } from '@mui/material';

import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useEvent from '../hooks/useEvent';

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
  const theme = useTheme();
  const eventUrl = useMemo(
    () =>
      event != null && event.data
        ? `${location.protocol}//${location.host}/o/${event.data.organization.id}/events/${eventId}`
        : '',
    [event?.data, eventId]
  );

  return (
    <Box mt={2}>
      <ZUICard
        header={isOpen ? messages.urlCard.open() : messages.urlCard.preview()}
        status={
          <Box
            sx={{
              backgroundColor: isOpen
                ? theme.palette.success.main
                : theme.palette.grey['500'],
              borderRadius: 5,
              height: 20,
              width: 20,
            }}
          />
        }
        subheader={
          isOpen
            ? messages.urlCard.nowAccepting()
            : messages.urlCard.willAccept()
        }
      >
        <Box display="flex" paddingBottom={2}>
          <ZUITextfieldToClipboard copyText={eventUrl}>
            {eventUrl}
          </ZUITextfieldToClipboard>
        </Box>
        <Link
          display="flex"
          href={`/o/${orgId}/events/${eventId}`}
          sx={{ alignItems: 'center', gap: 1 }}
          target="_blank"
        >
          <OpenInNew fontSize="inherit" />
          {isOpen ? (
            <Msg id={messageIds.urlCard.visitPortal} />
          ) : (
            <Msg id={messageIds.urlCard.previewPortal} />
          )}
        </Link>
      </ZUICard>
    </Box>
  );
};

export default EventURLCard;
