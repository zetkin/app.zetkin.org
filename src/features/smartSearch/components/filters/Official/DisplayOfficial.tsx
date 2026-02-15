import { Msg } from 'core/i18n';
import {
  OPERATION,
  SmartSearchFilterWithId,
  OfficialFilterConfig,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
const localMessageIds = messageIds.filters.official;

interface DisplayOfficialProps {
  filter: SmartSearchFilterWithId<OfficialFilterConfig>;
}

const DisplayOfficial = ({ filter }: DisplayOfficialProps): JSX.Element => {
  const role = filter.config.role || 'any';
  const op = filter.op || OPERATION.ADD;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        roleSelect: <UnderlinedMsg id={localMessageIds.roleSelect[role]} />,
      }}
    />
  );
};

export default DisplayOfficial;
