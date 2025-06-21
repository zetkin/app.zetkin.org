import useCallMutations from '../hooks/useCallMutations';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIModal from 'zui/components/ZUIModal';

type SkipCallDialogProps = {
  assignment: ZetkinCallAssignment;
  callId: number;
  onClose: () => void;
  open: boolean;
  targetName: string;
};

const SkipCallDialog: React.FC<SkipCallDialogProps> = ({
  assignment,
  callId,
  open,
  onClose,
  targetName,
}) => {
  const { deleteCall } = useCallMutations(assignment.organization.id);
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );

  return (
    <ZUIModal
      open={open}
      primaryButton={{
        label: 'Skip',
        onClick: () => {
          onClose();
          deleteCall(callId);
          allocateCall();
        },
      }}
      secondaryButton={{
        label: 'Resume',
        onClick: () => {
          onClose();
        },
      }}
      size="small"
      title={`Skip ${targetName} call?`}
    />
  );
};

export default SkipCallDialog;
