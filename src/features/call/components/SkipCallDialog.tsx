import useCallMutations from '../hooks/useCallMutations';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
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
  const { skipCurrentCall } = useCallMutations(assignment.organization.id);

  return (
    <ZUIModal
      open={open}
      primaryButton={{
        label: 'Skip',
        onClick: () => {
          skipCurrentCall(assignment.id, callId);
          onClose();
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
