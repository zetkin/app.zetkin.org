import { Msg } from 'core/i18n';
import {
  EmailBlacklistFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import { EMAIL_UNSUB_REASON } from '.';

const localMessageIds = messageIds.filters.emailBlacklist;

interface DisplayEmailBlacklistProps {
  filter: SmartSearchFilterWithId<EmailBlacklistFilterConfig>;
}

const DisplayEmailBlacklist = ({
  filter,
}: DisplayEmailBlacklistProps): JSX.Element => {
  const op = filter.op || OPERATION.ADD;
  const reason = EMAIL_UNSUB_REASON[filter.config.reason];

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        reasonSelect: (
          <UnderlinedMsg id={localMessageIds.reasonSelect[reason]} />
        ),
      }}
    />
  );
};

export default DisplayEmailBlacklist;
