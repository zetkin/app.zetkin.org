import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import eventsMessageIds from 'features/events/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import useEvent from 'features/events/hooks/useEvent';
import { useMessages } from 'core/i18n';

const localMessageIds = messageIds.filters.campaignParticipation;
const eventsLocalMessageIds = eventsMessageIds.common;

interface UnderlinedEventTitleProps {
  eventId: number;
  orgId: number;
}

const UnderlinedEventTitle: FC<UnderlinedEventTitleProps> = ({
  eventId,
  orgId,
}) => {
  const eventFuture = useEvent(orgId, eventId);
  const eventsMessages = useMessages(eventsLocalMessageIds);

  if (!eventFuture?.data) {
    return null;
  }

  const event = eventFuture.data;

  return (
    <UnderlinedMsg
      id={localMessageIds.eventSelect.event}
      values={{
        event: (
          <UnderlinedText text={event.title || eventsMessages.noTitle()} />
        ),
      }}
    />
  );
};

export default UnderlinedEventTitle;
