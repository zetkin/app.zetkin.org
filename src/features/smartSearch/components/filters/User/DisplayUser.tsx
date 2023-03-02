import { Msg } from 'core/i18n';
import {
  OPERATION,
  SmartSearchFilterWithId,
  UserFilterConfig,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.user;

interface DisplayUserProps {
  filter: SmartSearchFilterWithId<UserFilterConfig>;
}

const DisplayUser = ({ filter }: DisplayUserProps): JSX.Element => {
  const msgId = filter.config.is_user ? 'true' : 'false';
  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        connectedSelect: <Msg id={localMessageIds.connectedSelect[msgId]} />,
      }}
    />
  );
};

export default DisplayUser;
