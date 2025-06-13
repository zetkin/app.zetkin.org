'use client';

import { Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import StepsHeader from '../components/headers/StepsHeader';
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
          <StepsHeader
            assignment={assignment}
            call={call}
            onBack={() => setActiveStep(CallStep.STATS)}
            onPrimaryAction={() => setActiveStep(CallStep.ONGOING)}
            onPrimaryActionLabel={'Call'}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />

          <CallPrepare assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.ONGOING && call && (
        <>
          <StepsHeader
            assignment={assignment}
            call={call}
            onBack={() => setActiveStep(CallStep.STATS)}
            onPrimaryAction={() => setActiveStep(CallStep.REPORT)}
            onPrimaryActionLabel={'Finish and report'}
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
            onBack={() => setActiveStep(CallStep.STATS)}
            onPrimaryAction={() => setActiveStep(CallStep.SUMMARY)}
            onPrimaryActionLabel={'Submit report'}
            onSecondaryAction={() => setActiveStep(CallStep.ONGOING)}
            onSecondaryActionLabel={'Back to activities'}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />
          <CallReport assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.SUMMARY && call && (
        <>
          <StepsHeader
            assignment={assignment}
            call={call}
            forwardButtonIsLoading={isLoading}
            onBack={() => setActiveStep(CallStep.STATS)}
            onPrimaryAction={async () => {
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
            onPrimaryActionLabel={'Keep calling'}
            onSecondaryAction={() => setActiveStep(CallStep.STATS)}
            onSecondaryActionLabel={'Take a break'}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />
          <CallSummary />
        </>
      )}
    </Box>
  );
};

export default CallPage;
