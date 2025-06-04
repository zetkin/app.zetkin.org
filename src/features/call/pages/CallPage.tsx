'use client';

import { Box } from '@mui/material';
import { FC, useState } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import PrepareHeader from '../components/headers/PrepareHeader';
import StatsHeader from '../components/headers/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import OngoingHeader from '../components/headers/OngoingHeader';
import CallReport from '../components/CallReport';
import CallSummary from '../components/CallSummary';

type Props = {
  callAssId: string;
};

export enum CallStep {
  STATS = 0,
  PREPARE = 1,
  ONGOING = 2,
  REPORT = 3,
  SUMMARY = 4,
}

const CallPage: FC<Props> = ({ callAssId }) => {
  const [activeStep, setActiveStep] = useState<CallStep>(CallStep.STATS);
  const assignments = useMyCallAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  return (
    <Box>
      {activeStep == CallStep.STATS && assignment && (
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
      {activeStep == CallStep.PREPARE && assignment && (
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
      {activeStep == CallStep.ONGOING && assignment && (
        <>
          <OngoingHeader
            assignment={assignment}
            onReportCall={() => setActiveStep(CallStep.REPORT)}
            step={CallStep.ONGOING}
          />
          <CallOngoing assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.REPORT && assignment && (
        <>
          <OngoingHeader
            assignment={assignment}
            onBack={() => setActiveStep(CallStep.ONGOING)}
            step={CallStep.REPORT}
          />

          <CallReport
            assignment={assignment}
            onSummarize={() => setActiveStep(CallStep.SUMMARY)}
          />
        </>
      )}
      {activeStep == CallStep.SUMMARY && assignment && (
        <>
          <OngoingHeader
            assignment={assignment}
            onBack={() => setActiveStep(CallStep.STATS)}
            onReportCall={() => setActiveStep(CallStep.PREPARE)}
            onSummarize={() => setActiveStep(CallStep.PREPARE)}
            step={CallStep.SUMMARY}
          />
          <CallSummary />
        </>
      )}
    </Box>
  );
};

export default CallPage;
