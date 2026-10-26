import DisplayCallAssignmentTitle from '../CallHistory/DisplayCallAssignmentTitle';
import { Msg } from 'core/i18n';
import {
  CallerFilterConfig,
  OPERATION,
  SmartSearchFilterWithId,
} from 'features/smartSearch/components/types';
import messageIds from 'features/smartSearch/l10n/messageIds';
import UnderlinedMsg from '../../UnderlinedMsg';
import { useNumericRouteParams } from 'core/hooks';

const localMessageIds = messageIds.filters.caller;

interface DisplayCallerProps {
  filter: SmartSearchFilterWithId<CallerFilterConfig>;
}

const DisplayCaller = ({ filter }: DisplayCallerProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const config = filter.config;
  const assignmentId = config.assignment;
  const op = filter.op || OPERATION.ADD;
  const callerSelect = localMessageIds.callerSelect[config.operator];

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
        callerSelect: <UnderlinedMsg id={callerSelect} />,
      }}
    />
  );
};

export default DisplayCaller;
