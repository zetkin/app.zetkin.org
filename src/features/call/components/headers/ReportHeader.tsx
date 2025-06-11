import { FC, useState } from 'react';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useAppSelector } from 'core/hooks';
import useCallMutations from '../../hooks/useCallMutations';
import StepsHeader from './StepsHeader';
import { ZetkinCall } from 'features/call/types';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  onBack: () => void;
  onPrimaryAction: () => void;
  onPrimaryActionLabel: string;
  onSecondaryAction?: () => void;
  onSecondaryActionLabel?: string;
  onSwitchCall: () => void;
};

const ReportHeader: FC<Props> = ({
  assignment,
  call,
  onBack,
  onPrimaryAction,
  onPrimaryActionLabel,
  onSecondaryAction,
  onSecondaryActionLabel,
  onSwitchCall,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { updateCall } = useCallMutations(assignment.organization.id);
  const stateList = useAppSelector((state) => state.call.stateByCallId);
  const callState = stateList[call.id]?.data;
  const reportIsDone = callState && !!callState.report;

  return (
    <StepsHeader
      assignment={assignment}
      call={call}
      forwardButtonDisabled={!reportIsDone}
      forwardButtonIsLoading={isLoading}
      onBack={onBack}
      onPrimaryAction={async () => {
        if (reportIsDone) {
          setIsLoading(true);
          await updateCall(call.id, callState.report);
          sessionStorage.clear();
          //TODO: Error handling
          onPrimaryAction();
          setIsLoading(false);
        }
      }}
      onPrimaryActionLabel={onPrimaryActionLabel}
      onSecondaryAction={onSecondaryAction}
      onSecondaryActionLabel={onSecondaryActionLabel}
      onSwitchCall={onSwitchCall}
    />
  );
};

export default ReportHeader;
