'use client';

import { Box } from '@mui/material';
import { FC, useState } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import PrepareHeader from '../components/PrepareHeader';
import StatsHeader from '../components/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import OngoingHeader from '../components/OngoingHeader';
import CallReport from '../components/CallReport';
import CallSummary from '../components/CallSummary';
import useAllocateCall from '../hooks/useAllocateCall';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportHeader from '../components/ReportHeader';

type Props = {
  callAssId: string;
  orgId: number;
};

export enum CallStep {
  STATS = 0,
  PREPARE = 1,
  ONGOING = 2,
  REPORT = 3,
  SUMMARY = 4,
}

const CallPage: FC<Props> = ({ callAssId, orgId }) => {
  const [activeStep, setActiveStep] = useState<CallStep>(CallStep.STATS);
  const assignments = useMyCallAssignments();
  const currentCall = useCurrentCall();

  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );
  const { allocateCall } = useAllocateCall(orgId, parseInt(callAssId));

  if (!assignment) {
    return null;
  }

  return (
    <Box>
      {activeStep == CallStep.STATS && (
        <>
          <StatsHeader
            assignment={assignment}
            onPrepareCall={() => setActiveStep(CallStep.PREPARE)}
          />
          <CallStats
            assignment={assignment}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />
        </>
      )}
      {activeStep == CallStep.PREPARE && (
        <>
          <PrepareHeader
            assignment={assignment}
            onBack={() => setActiveStep(CallStep.STATS)}
            onStartCall={() => setActiveStep(CallStep.ONGOING)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />

          <CallPrepare assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.ONGOING && (
        <>
          <OngoingHeader
            assignment={assignment}
            forwardButtonLabel="Finish and report"
            onForward={() => setActiveStep(CallStep.REPORT)}
            step={CallStep.ONGOING}
          />
          <CallOngoing assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.REPORT && currentCall && (
        <>
          <ReportHeader
            assignment={assignment}
            callId={currentCall.id}
            onBack={() => setActiveStep(CallStep.ONGOING)}
            onForward={() => setActiveStep(CallStep.SUMMARY)}
          />
          <CallReport assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.SUMMARY && (
        <>
          <OngoingHeader
            assignment={assignment}
            forwardButtonLabel="Keep calling"
            onBack={() => setActiveStep(CallStep.STATS)}
            onForward={() => {
              setActiveStep(CallStep.PREPARE);
              allocateCall();
            }}
            step={CallStep.SUMMARY}
          />
          <CallSummary />
        </>
      )}
    </Box>
  );
};

export default CallPage;
