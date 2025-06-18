import { FC, useState } from 'react';

import SkipCallDialog from '../SkipCallDialog';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { ZetkinCall } from 'features/call/types';
import CallHeader from './CallHeader';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  onBack: () => void;
  onForward: () => void;
  onSwitchCall: () => void;
};

const PrepareHeader: FC<Props> = ({
  assignment,
  call,
  onBack,
  onForward,
  onSwitchCall,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <CallHeader
        assignment={assignment}
        call={call}
        forwardButtonLabel="Call"
        onBack={() => onBack()}
        onForward={() => onForward()}
        onSecondaryAction={() => setOpen(true)}
        onSwitchCall={() => onSwitchCall()}
        secondaryActionLabel="Skip"
      />
      <SkipCallDialog
        assignment={assignment}
        callId={call.id}
        onClose={() => setOpen(false)}
        open={open}
        targetName={`${call.target.first_name} ${call.target.last_name}`}
      />
    </>
  );
};

export default PrepareHeader;
