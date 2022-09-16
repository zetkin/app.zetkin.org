import { FormattedMessage as Msg } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';

import getCallAssignment from 'features/callAssignments/api/getCallAssignment';
import { getTimeFrameWithConfig } from '../../utils';
import {
  CallHistoryFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';

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
      id="misc.smartSearch.call_history.inputString"
      values={{
        addRemoveSelect: (
          <Msg id={`misc.smartSearch.call_history.addRemoveSelect.${op}`} />
        ),
        assignmentSelect: assignmentTitle ? (
          <Msg
            id="misc.smartSearch.call_history.assignmentSelect.assignment"
            values={{
              assignmentTitle,
            }}
          />
        ) : (
          <Msg id="misc.smartSearch.call_history.assignmentSelect.any" />
        ),
        callSelect: (
          <Msg id={`misc.smartSearch.call_history.callSelect.${operator}`} />
        ),
        minTimes: minTimes || 1,
        minTimesInput: minTimes,
        timeFrame: (
          <Msg
            id={`misc.smartSearch.timeFrame.preview.${timeFrame}`}
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
