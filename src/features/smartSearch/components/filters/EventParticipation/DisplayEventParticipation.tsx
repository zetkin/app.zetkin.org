import { Msg } from 'core/i18n';
import {
  EventParticipationConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';
import useEvent from 'features/events/hooks/useEvent';
import UnderlinedText from '../../UnderlinedText';

const localMessageIds = messageIds.filters.eventParticipation;

interface DisplayEventParticipationProps {
  filter: SmartSearchFilterWithId<EventParticipationConfig>;
}

const DisplayEventParticipation = ({
  filter,
}: DisplayEventParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const { state, status, action } = config;
  const op = filter.op || OPERATION.ADD;

  const event = useEvent(orgId, action);

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
              event?.data
                ? event.data.title ?? `Untitled Event #${event.data.id}`
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
