import UpdateContainer from './elements/UpdateContainer';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import { AnyMessage, Msg } from 'core/i18n';
import { UPDATE_TYPES, ZetkinUpdate } from 'zui/ZUITimeline/types';

import messageIds from '../l10n/messageIds';

interface TimelineGenericProps {
  update: ZetkinUpdate;
}

function messageIdFromType(type: UPDATE_TYPES): AnyMessage | null {
  if (type == UPDATE_TYPES.JOURNEYINSTANCE_OPEN) {
    return messageIds.updates.journeyinstance.open;
  }

  return null;
}

const TimelineGeneric: React.FC<TimelineGenericProps> = ({ update }) => {
  const msgId = messageIdFromType(update.type);

  if (!msgId) {
    return null;
  }

  return (
    <UpdateContainer
      headerContent={
        <Msg
          id={msgId}
          values={{ actor: <ZUIPersonLink person={update.actor} /> }}
        />
      }
      update={update}
    />
  );
};

export default TimelineGeneric;
