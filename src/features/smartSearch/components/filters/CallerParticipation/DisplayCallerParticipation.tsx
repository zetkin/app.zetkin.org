import DisplayCallAssignmentTitle from '../CallHistory/DisplayCallAssignmentTitle';
import { Msg } from 'core/i18n';
import { getLoggedCallCountWithConfig } from './utils';
import {
  CallerParticipationFilterConfig,
  MATCHING,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';

const localMessageIds = messageIds.filters.callerParticipation;

interface DisplayCallerParticipationProps {
  filter: SmartSearchFilterWithId<CallerParticipationFilterConfig>;
}

const getCallCountPreview = (
  callCount: ReturnType<typeof getLoggedCallCountWithConfig>
) => {
  if (callCount.option === MATCHING.ONCE) {
    return <UnderlinedMsg id={localMessageIds.callCount.preview.once} />;
  }

  return (
    <UnderlinedMsg
      id={localMessageIds.callCount.preview[callCount.option]}
      values={{
        max: callCount.config?.max ?? 0,
        min: callCount.config?.min ?? 0,
      }}
    />
  );
};

const DisplayCallerParticipation = ({
  filter,
}: DisplayCallerParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const assignmentId = filter.config.assignment;
  const op = filter.op || OPERATION.ADD;
  const callCount = getLoggedCallCountWithConfig(filter.config.num_calls);

  return (
    <Msg
      id={localMessageIds.previewString}
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
        callCountSelect: getCallCountPreview(callCount),
      }}
    />
  );
};

export default DisplayCallerParticipation;
