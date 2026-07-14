import { useMessages } from 'core/i18n';
import useCallMutations from '../hooks/useCallMutations';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIModal from 'zui/components/ZUIModal';
import messageIds from '../l10n/messageIds';

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
  const messages = useMessages(messageIds);
  const { skipCurrentCall } = useCallMutations(assignment.organization.id);

  return (
    <ZUIModal
      open={open}
      primaryButton={{
        label: messages.skipCallDialog.confirmButton({ name: targetName }),
        onClick: () => {
          skipCurrentCall(assignment.id, callId);
          onClose();
        },
      }}
      secondaryButton={{
        label: messages.skipCallDialog.cancelButton(),
        onClick: () => {
          onClose();
        },
      }}
      size="small"
      title={messages.skipCallDialog.title({ name: targetName })}
    />
  );
};

export default SkipCallDialog;
