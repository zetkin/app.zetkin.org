'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import StatsHeader from '../components/headers/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import CallReport from '../components/CallReport';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportHeader from '../components/headers/ReportHeader';
import useAllocateCall from '../hooks/useAllocateCall';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PrepareHeader from '../components/headers/PrepareHeader';
import CallHeader from '../components/headers/CallHeader';
import { LaneStep, ZetkinCall } from '../types';
import ZUIModal from 'zui/components/ZUIModal';
import CallSummarySentence from '../components/CallSummarySentence';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import { updateLaneStep } from '../store';

type Props = {
  assignment: ZetkinCallAssignment;
};

const CallPage: FC<Props> = ({ assignment }) => {
  const dispatch = useAppDispatch();
  const lane = useAppSelector(
    (state) => state.call.lanes[state.call.activeLaneIndex]
  );
  const [previousCall, setPreviousCall] = useState<ZetkinCall | null>(null);
  const call = useCurrentCall();
  const router = useRouter();
  const { allocateCall } = useAllocateCall(
    assignment?.organization.id,
    assignment?.id
  );

  return (
    <Box>
      {lane.step == LaneStep.STATS && (
        <>
          <StatsHeader assignment={assignment} />
          <CallStats assignment={assignment} />
        </>
      )}
      {lane.step == LaneStep.PREPARE && call && (
        <>
          <PrepareHeader assignment={assignment} call={call} />
          <CallPrepare assignment={assignment} />
          <ZUIModal
            open={!!previousCall}
            primaryButton={{
              label: 'Close',
              onClick: () => setPreviousCall(null),
            }}
            title="Summary of previous call"
          >
            {previousCall && <CallSummarySentence call={previousCall} />}
          </ZUIModal>
        </>
      )}
      {lane.step == LaneStep.ONGOING && call && (
        <>
          <CallHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Finish and report'}
            onBack={() => dispatch(updateLaneStep(LaneStep.STATS))}
            onForward={() => dispatch(updateLaneStep(LaneStep.REPORT))}
            onSwitchCall={() => dispatch(updateLaneStep(LaneStep.PREPARE))}
          />
          <CallOngoing assignment={assignment} />
        </>
      )}
      {lane.step == LaneStep.REPORT && call && (
        <>
          <ReportHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Submit report'}
            onBack={() => dispatch(updateLaneStep(LaneStep.STATS))}
            onForward={async () => {
              const result = await allocateCall();
              if (result) {
                dispatch(updateLaneStep(LaneStep.STATS));
                router.push(`/call/${assignment.id}`);
              } else {
                setPreviousCall(call);
                dispatch(updateLaneStep(LaneStep.PREPARE));
              }
            }}
            onSecondaryAction={() => dispatch(updateLaneStep(LaneStep.ONGOING))}
            onSwitchCall={() => dispatch(updateLaneStep(LaneStep.PREPARE))}
            secondaryActionLabel={'Back to activities'}
          />
          <CallReport assignment={assignment} />
        </>
      )}
    </Box>
  );
};

export default CallPage;
