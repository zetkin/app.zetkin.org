'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import StatsHeader from '../components/headers/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import CallReport from '../components/CallReport';
import CallSummary from '../components/CallSummary';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportHeader from '../components/headers/ReportHeader';
import useAllocateCall from '../hooks/useAllocateCall';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PrepareHeader from '../components/headers/PrepareHeader';
import CallHeader from '../components/headers/CallHeader';

type Props = {
  assignment: ZetkinCallAssignment;
};

export enum CallStep {
  STATS = 0,
  PREPARE = 1,
  ONGOING = 2,
  REPORT = 3,
  SUMMARY = 4,
}

const CallPage: FC<Props> = ({ assignment }) => {
  const [activeStep, setActiveStep] = useState<CallStep>(CallStep.STATS);
  const [isLoading, setIsLoading] = useState(false);
  const call = useCurrentCall();
  const router = useRouter();
  const { allocateCall } = useAllocateCall(
    assignment?.organization.id,
    assignment?.id
  );

  return (
    <Box>
      {activeStep == CallStep.STATS && (
        <>
          <StatsHeader
            assignment={assignment}
            onBack={() => setActiveStep(CallStep.STATS)}
            onPrimaryAction={() => setActiveStep(CallStep.PREPARE)}
          />
          <CallStats
            assignment={assignment}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />
        </>
      )}
      {activeStep == CallStep.PREPARE && call && (
        <>
          <PrepareHeader
            assignment={assignment}
            call={call}
            onBack={() => setActiveStep(CallStep.STATS)}
            onForward={() => setActiveStep(CallStep.ONGOING)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />

          <CallPrepare assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.ONGOING && call && (
        <>
          <CallHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Finish and report'}
            onBack={() => setActiveStep(CallStep.STATS)}
            onForward={() => setActiveStep(CallStep.REPORT)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />
          <CallOngoing assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.REPORT && call && (
        <>
          <ReportHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Submit report'}
            onBack={() => setActiveStep(CallStep.STATS)}
            onForward={() => setActiveStep(CallStep.SUMMARY)}
            onSecondaryAction={() => setActiveStep(CallStep.ONGOING)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
            secondaryActionLabel={'Back to activities'}
          />
          <CallReport assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.SUMMARY && call && (
        <>
          <CallHeader
            assignment={assignment}
            call={call}
            forwardButtonLabel={'Keep calling'}
            forwardButtonLoading={isLoading}
            onBack={() => setActiveStep(CallStep.STATS)}
            onForward={async () => {
              setIsLoading(true);
              const result = await allocateCall();
              if (result) {
                setIsLoading(false);
                setActiveStep(CallStep.STATS);
                router.push(`/call/${assignment.id}`);
              } else {
                setIsLoading(false);
                setActiveStep(CallStep.PREPARE);
              }
            }}
            onSecondaryAction={() => setActiveStep(CallStep.STATS)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
            secondaryActionLabel={'Take a break'}
          />
          <CallSummary />
        </>
      )}
    </Box>
  );
};

export default CallPage;
