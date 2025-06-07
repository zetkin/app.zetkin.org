import { FC, useState } from 'react';

import OngoingHeader from './OngoingHeader';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { CallStep } from '../pages/CallPage';
import { useAppSelector } from 'core/hooks';
import useCallMutations from '../hooks/useCallMutations';

type Props = {
  assignment: ZetkinCallAssignment;
  callId: number;
  onBack: () => void;
  onForward: () => void;
};

const ReportHeader: FC<Props> = ({ assignment, callId, onBack, onForward }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCall } = useCallMutations(assignment.organization.id);
  const stateList = useAppSelector((state) => state.call.stateByCallId);
  const callState = stateList[callId]?.data;
  const reportIsDone = callState && !!callState.report;

  return (
    <OngoingHeader
      assignment={assignment}
      forwardButtonDisabled={!reportIsDone}
      forwardButtonIsLoading={isLoading}
      forwardButtonLabel="Submit report"
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
      step={CallStep.REPORT}
    />
  );
};

export default ReportHeader;
