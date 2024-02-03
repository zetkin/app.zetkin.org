import DisplayCallAssignmentTitle from './DisplayCallAssignmentTitle';
import DisplayTimeFrame from '../DisplayTimeFrame';
import { getTimeFrameWithConfig } from '../../utils';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';
import {
  CallHistoryFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

const localMessageIds = messageIds.filters.callHistory;

interface DisplayCallHistoryProps {
  filter: SmartSearchFilterWithId<CallHistoryFilterConfig>;
}

const DisplayCallHistory = ({
  filter,
}: DisplayCallHistoryProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const { config } = filter;
  const { minTimes, operator, assignment: assignmentId } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: <UnderlinedMsg id={messageIds.operators[op]} />,
        assignmentSelect: assignmentId ? (
          <DisplayCallAssignmentTitle
            assignmentId={assignmentId}
            orgId={orgId}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.assignmentSelect.any} />
        ),
        callSelect: <UnderlinedMsg id={localMessageIds.callSelect[operator]} />,
        minTimes: (
          <UnderlinedMsg
            id={localMessageIds.minTimes}
            values={{ minTimes: minTimes || 1 }}
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayCallHistory;
