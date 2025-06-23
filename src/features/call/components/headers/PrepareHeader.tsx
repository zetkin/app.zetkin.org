import { FC, useState } from 'react';

import SkipCallDialog from '../SkipCallDialog';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { LaneStep, ZetkinCall } from 'features/call/types';
import CallHeader from './CallHeader';
import { useAppDispatch } from 'core/hooks';
import { updateLaneStep } from 'features/call/store';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
};

const PrepareHeader: FC<Props> = ({ assignment, call }) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  return (
    <>
      <CallHeader
        assignment={assignment}
        call={call}
        forwardButtonLabel="Call"
        onBack={() => dispatch(updateLaneStep(LaneStep.STATS))}
        onForward={() => dispatch(updateLaneStep(LaneStep.ONGOING))}
        onSecondaryAction={() => setOpen(true)}
        onSwitchCall={() => dispatch(updateLaneStep(LaneStep.PREPARE))}
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
