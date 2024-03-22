import { Msg } from 'core/i18n';
import {
  EmailClickFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';

const localMessageIds = messageIds.filters.emailClick;

interface DisplayEmailBlacklistProps {
  filter: SmartSearchFilterWithId<EmailClickFilterConfig>;
}

const DisplayEmailClick = ({
  filter,
}: DisplayEmailBlacklistProps): JSX.Element => {
  const op = filter.op || OPERATION.ADD;
  const operator =
    filter.config.operator === 'clicked' ? 'clicked' : 'notClicked';
  const emailSelect = filter.config.email;

  return <h1>hello</h1>;
  /* <Msg
    id={localMessageIds.inputString}
    values={{
    addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
    clickSelect: (
        <UnderlinedMsg id={localMessageIds.clickSelect[operator]} />
    ),
    emailSelect: (
        <Msg
        id={localMessageIds.emailSelect}
        values={{
            assignmentTitle: <UnderlinedText text={data?.title} />,
        }}
        />
    ),
    }}
/> */
};

export default DisplayEmailClick;
