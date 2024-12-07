import { FC } from 'react';

import {
  JoinFormFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from '../../types';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';
import DisplayJoinFormTitle from './DisplayJoinFormTitle';
import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';

type Props = {
  filter: SmartSearchFilterWithId<JoinFormFilterConfig>;
};

const localMessageIds = messageIds.filters.joinForm;

const DisplayJoinForm: FC<Props> = ({ filter }) => {
  const { orgId } = useNumericRouteParams();
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: filter.config.submitted?.after,
    before: filter.config.submitted?.before,
  });

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        formSelect: filter.config.form ? (
          <DisplayJoinFormTitle formId={filter.config.form} orgId={orgId} />
        ) : (
          <UnderlinedMsg id={localMessageIds.anyForm} />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayJoinForm;
