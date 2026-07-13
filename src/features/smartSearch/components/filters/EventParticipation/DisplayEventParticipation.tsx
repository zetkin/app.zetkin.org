import { useMemo } from 'react';

import { Msg, useMessages } from 'core/i18n';
import {
  EventParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
import eventsMessageIds from 'features/events/l10n/messageIds';
import useOrgEvents from 'features/smartSearch/hooks/useOrgEvents';
import { useNumericRouteParams } from 'core/hooks';
import useOrgIdsFromOrgScope from 'features/smartSearch/hooks/useOrgIdsFromOrgScope';

const localMessageIds = messageIds.filters.eventParticipation;

interface DisplayEventParticipationProps {
  filter: SmartSearchFilterWithId<EventParticipationConfig>;
}

const DisplayEventParticipation = ({
  filter,
}: DisplayEventParticipationProps): JSX.Element => {
  const eventsMessages = useMessages(eventsMessageIds);
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const { state, status, action } = config;
  const op = filter.op || OPERATION.ADD;

  const orgIds = useOrgIdsFromOrgScope(
    orgId,
    filter.config.organizations || [orgId]
  );
  const multiFilterActive = orgIds.length > 1;
  const searchOrgId = orgIds.length === 1 ? orgIds[0] : orgId;

  const events = useOrgEvents(searchOrgId, multiFilterActive);
  const event = useMemo(
    () => events.data?.find((ev) => ev.id === action),
    [events, action]
  );

  return (
    <Msg
      id={messageIds.filters.eventParticipation.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        bookedSelect: (
          <UnderlinedMsg id={localMessageIds.bookedSelect[state]} />
        ),
        eventSelect: (
          <UnderlinedText
            text={
              event
                ? event.title ||
                  event.activity?.title ||
                  eventsMessages.common.noTitle()
                : ''
            }
          />
        ),
        statusSelect: status ? (
          <UnderlinedMsg id={localMessageIds.statusSelect[status]} />
        ) : (
          <UnderlinedMsg id={localMessageIds.statusSelect.any} />
        ),
      }}
    />
  );
};

export default DisplayEventParticipation;
