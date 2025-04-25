import { useState } from 'react';

import useCallMutations from '../hooks/useCallMutations';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useAllocateCall from '../hooks/useAllocateCall';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIModal from 'zui/components/ZUIModal';
import ZUIText from 'zui/components/ZUIText';

type SkipCallDialogProps = {
  assignment: ZetkinCallAssignment;
  callId: number;
  targetName: string;
};

const SkipCallDialog: React.FC<SkipCallDialogProps> = ({
  assignment,
  callId,
  targetName,
}) => {
  const [open, setOpen] = useState(false);
  const { deleteCall } = useCallMutations(assignment.organization.id);
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );

  return (
    <>
      <ZUIButton
        label="Skip"
        onClick={() => setOpen(true)}
        variant="secondary"
      />
      {/* TODO: Implement new ZUIModal for confirmation dialogs */}
      <ZUIModal
        onClose={() => setOpen(false)}
        open={open}
        primaryButton={{
          label: 'Skip',
          onClick: () => {
            setOpen(false);
            deleteCall(callId);
            allocateCall();
          },
        }}
        secondaryButton={{
          label: 'Resume',
          onClick: () => {
            setOpen(false);
          },
        }}
        size="small"
        title={`Skip ${targetName} call?`}
      >
        <ZUIText>this sentence will be removed</ZUIText>
      </ZUIModal>
    </>
  );
};

export default SkipCallDialog;
