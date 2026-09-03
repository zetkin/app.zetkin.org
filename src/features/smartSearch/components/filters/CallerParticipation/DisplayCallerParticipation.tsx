import DisplayCallAssignmentTitle from '../CallHistory/DisplayCallAssignmentTitle';
import { Msg } from 'core/i18n';
import { getLoggedCallCountWithConfig } from './utils';
import {
  CallerParticipationFilterConfig,
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

const DisplayCallerParticipation = ({
  filter,
}: DisplayCallerParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const assignmentId = filter.config.assignment;
  const op = filter.op || OPERATION.ADD;
  const { config: callCountConfig, option: callCountOption } =
    getLoggedCallCountWithConfig(filter.config.num_calls);

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
        callCountSelect: (
          <UnderlinedMsg
            id={localMessageIds.callCount.preview[callCountOption]}
            values={{
              max: callCountConfig?.max ?? 0,
              min: callCountConfig?.min ?? 0,
            }}
          />
        ),
      }}
    />
  );
};

export default DisplayCallerParticipation;
