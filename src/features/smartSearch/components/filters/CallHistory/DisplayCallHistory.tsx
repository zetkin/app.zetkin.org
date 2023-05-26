import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import DisplayTimeFrame from '../DisplayTimeFrame';
import getCallAssignment from 'features/callAssignments/api/getCallAssignment';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  CallHistoryFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import UnderlinedText from '../../UnderlinedText';
const localMessageIds = messageIds.filters.callHistory;

interface DisplayCallHistoryProps {
  filter: SmartSearchFilterWithId<CallHistoryFilterConfig>;
}

const DisplayCallHistory = ({
  filter,
}: DisplayCallHistoryProps): JSX.Element => {
  const { orgId } = useRouter().query;
  const { config } = filter;
  const { minTimes, operator, assignment: assignmentId } = config;
  const op = filter.op || OPERATION.ADD;
  const timeFrame = getTimeFrameWithConfig({
    after: config.after,
    before: config.before,
  });

  const assignmentQuery = useQuery(
    ['assignment', orgId, assignmentId],
    getCallAssignment(orgId as string, assignmentId?.toString() as string),
    { enabled: !!assignmentId }
  );

  const assignmentTitle = assignmentQuery?.data?.title || null;

  return (
    <Msg
      id={localMessageIds.inputString}
      values={{
        addRemoveSelect: (
          <UnderlinedMsg id={messageIds.addLimitRemoveSelect[op]} />
        ),
        assignmentSelect: assignmentTitle ? (
          <Msg
            id={localMessageIds.assignmentSelect.assignment}
            values={{
              assignmentTitle: <UnderlinedText text={assignmentTitle} />,
            }}
          />
        ) : (
          <UnderlinedMsg id={localMessageIds.assignmentSelect.any} />
        ),
        callSelect: <UnderlinedMsg id={localMessageIds.callSelect[operator]} />,
        minTimes: (
          <UnderlinedMsg
            id={localMessageIds.minTimes}
            values={{ minTimes: minTimes || 1, minTimesInput: minTimes || 1 }}
          />
        ),
        minTimesInput: (
          <UnderlinedMsg
            id={localMessageIds.minTimesInput}
            values={{ minTimesInput: minTimes || 1 }}
          />
        ),
        timeFrame: <DisplayTimeFrame config={timeFrame} />,
      }}
    />
  );
};

export default DisplayCallHistory;
