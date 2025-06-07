import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { CallStep } from '../pages/CallPage';
import { useAppSelector } from 'core/hooks';
import useCallMutations from '../hooks/useCallMutations';
import StepsHeader from './headers/StepsHeader';

type Props = {
  assignment: ZetkinCallAssignment;
  callId: number;
  onBack: () => void;
  onForward: () => void;
  onSwitchCall: () => void;
};

const ReportHeader: FC<Props> = ({
  assignment,
  callId,
  onBack,
  onForward,
  onSwitchCall,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCall } = useCallMutations(assignment.organization.id);
  const stateList = useAppSelector((state) => state.call.stateByCallId);
  const callState = stateList[callId]?.data;
  const reportIsDone = callState && !!callState.report;

  return (
    <StepsHeader
      assignment={assignment}
      forwardButtonDisabled={!reportIsDone}
      forwardButtonIsLoading={isLoading}
      onBack={onBack}
      onForward={async () => {
        if (reportIsDone) {
          setIsLoading(true);
          await updateCall(callId, callState.report);
          sessionStorage.clear();
          //TODO: Error handling
          onForward();
          setIsLoading(false);
        }
      }}
      onSwitchCall={onSwitchCall}
      step={CallStep.REPORT}
    />
  );
};

export default ReportHeader;
