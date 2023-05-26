import { Msg } from 'core/i18n';
import {
  CallBlockedFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';

const localMessageIds = messageIds.filters.callBlocked;

interface DisplayCallBlockedProps {
  filter: SmartSearchFilterWithId<CallBlockedFilterConfig>;
}

const DisplayCallBlocked = ({
  filter,
}: DisplayCallBlockedProps): JSX.Element => {
  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
      }}
    />
  );
};

export default DisplayCallBlocked;
