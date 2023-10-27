import { FC } from 'react';

import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import UnderlinedText from '../../UnderlinedText';
import useCallAssignment from 'features/callAssignments/hooks/useCallAssignment';

const localMessageIds = messageIds.filters.callHistory;

interface DisplayCallAssignmentTitleProps {
  assignmentId: number;
  orgId: number;
}

const DisplayCallAssignmentTitle: FC<DisplayCallAssignmentTitleProps> = ({
  assignmentId,
  orgId,
}) => {
  const { data } = useCallAssignment(orgId, assignmentId);

  return (
    <Msg
      id={localMessageIds.assignmentSelect.assignment}
      values={{
        assignmentTitle: <UnderlinedText text={data?.title} />,
      }}
    />
  );
};

export default DisplayCallAssignmentTitle;
