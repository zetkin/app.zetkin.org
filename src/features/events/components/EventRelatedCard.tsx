import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import messageIds from 'features/events/l10n/messageIds';
import RelatedEvent from './RelatedEvent';
import { useMessages } from 'core/i18n';
import useRelatedEvents from '../hooks/useRelatedEvents';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';

interface EventRelatedCardProps {
  data: ZetkinEvent;
  orgId: number;
}

const EventRelatedCard: FC<EventRelatedCardProps> = ({ data, orgId }) => {
  const messages = useMessages(messageIds);
  const relatedEvents = useRelatedEvents(data, orgId);

  return (
    <ZUIFuture future={relatedEvents}>
      {(events) => {
        return (
          <>
            {events.length > 0 && (
              <Box mt={2}>
                <ZUICard header={messages.eventRelatedCard.header()}>
                  <Box>
                    {events.map((event, index) => {
                      return (
                        <Box key={event.id}>
                          {index > 0 && (
                            <Divider sx={{ marginBottom: 1, marginTop: 1 }} />
                          )}
                          <RelatedEvent event={event} />
                        </Box>
                      );
                    })}
                  </Box>
                </ZUICard>
              </Box>
            )}
          </>
        );
      }}
    </ZUIFuture>
  );
};

export default EventRelatedCard;
