import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getCallAssignment from 'features/callAssignments/api/getCallAssignment';
import { getTimeFrameWithConfig } from '../../utils';
import { Msg } from 'core/i18n';
import {
  CallHistoryFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
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
  const { after, before, numDays, timeFrame } = getTimeFrameWithConfig({
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
        addRemoveSelect: <Msg id={localMessageIds.addRemoveSelect[op]} />,
        assignmentSelect: assignmentTitle ? (
          <Msg
            id={localMessageIds.assignmentSelect.assignment}
            values={{
              assignmentTitle,
            }}
          />
        ) : (
          <Msg id={localMessageIds.assignmentSelect.any} />
        ),
        callSelect: <Msg id={localMessageIds.callSelect[operator]} />,
        minTimes: minTimes || 1,
        minTimesInput: minTimes || 1,
        timeFrame: (
          <Msg
            id={messageIds.timeFrame.preview[timeFrame]}
            values={{
              afterDate: after?.toISOString().slice(0, 10),
              beforeDate: before?.toISOString().slice(0, 10),
              days: numDays,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplayCallHistory;
