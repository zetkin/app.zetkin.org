import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

import useCallMutations from '../hooks/useCallMutations';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useAllocateCall from '../hooks/useAllocateCall';

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
      <Button onClick={() => setOpen(true)} sx={{ mr: 1 }} variant="outlined">
        Skip
      </Button>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle variant="h6">Skip {targetName} call?</DialogTitle>
        <DialogActions sx={{ justifyContent: ' center' }}>
          <Button
            color="error"
            onClick={() => {
              setOpen(false);
              deleteCall(callId);
              allocateCall();
            }}
            variant="contained"
          >
            Skip
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Resume
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SkipCallDialog;
