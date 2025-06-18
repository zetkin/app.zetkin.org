import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppSelector } from 'core/hooks';
import useCallMutations from '../../hooks/useCallMutations';
import { ZetkinCall } from 'features/call/types';
import CallHeader from './CallHeader';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  forwardButtonLabel: string;
  onBack: () => void;
  onForward: () => void;
  onSecondaryAction?: () => void;
  onSwitchCall: () => void;
  secondaryActionLabel?: string;
};

const ReportHeader: FC<Props> = ({
  assignment,
  call,
  onBack,
  onForward,
  forwardButtonLabel,
  onSecondaryAction,
  secondaryActionLabel,
  onSwitchCall,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCall } = useCallMutations(assignment.organization.id);
  const stateList = useAppSelector((state) => state.call.stateByCallId);
  const callState = stateList[call.id]?.data;
  const reportIsDone = callState && !!callState.report;

  return (
    <CallHeader
      assignment={assignment}
      call={call}
      forwardButtonDisabled={!reportIsDone}
      forwardButtonLabel={forwardButtonLabel}
      forwardButtonLoading={isLoading}
      onBack={onBack}
      onForward={async () => {
        if (reportIsDone) {
          setIsLoading(true);
          await updateCall(call.id, callState.report);
          sessionStorage.clear();
          //TODO: Error handling
          onForward();
          setIsLoading(false);
        }
      }}
      onSecondaryAction={onSecondaryAction}
      onSwitchCall={onSwitchCall}
      secondaryActionLabel={secondaryActionLabel}
    />
  );
};

export default ReportHeader;
