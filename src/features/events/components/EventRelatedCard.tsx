import { FC } from 'react';
import { Box, Divider } from '@mui/material';

import { EventsModel } from '../models/EventsModel';
import messageIds from 'features/events/l10n/messageIds';
import RelatedEvent from './RelatedEvent';
import { useMessages } from 'core/i18n';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import ZUIFuture from 'zui/ZUIFuture';

interface EventRelatedCardProps {
  data: ZetkinEvent;
  model: EventsModel;
}

const EventRelatedCard: FC<EventRelatedCardProps> = ({ data, model }) => {
  const messages = useMessages(messageIds);

  return (
    <ZUIFuture future={model.getRelatedEvents(data)}>
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
