'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import PrepareHeader from '../components/PrepareHeader';
import StatsHeader from '../components/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import OngoingHeader from '../components/OngoingHeader';

type Props = {
  callAssId: string;
  children?: ReactNode;
};

export enum CallStep {
  STATS = 0,
  PREPARE = 1,
  ONGOING = 2,
  REPORT = 3,
}

const CallPage: FC<Props> = ({ callAssId, children }) => {
  const [activeStep, setActiveStep] = useState<CallStep>(CallStep.STATS);
  const assignments = useMyCallAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  return (
    <Box>
      {activeStep == CallStep.STATS && assignment && (
        <>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.common.white,
            })}
          >
            <StatsHeader
              assignment={assignment}
              onPrepareCall={() => setActiveStep(CallStep.PREPARE)}
            />
          </Box>
          <CallStats assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.PREPARE && assignment && (
        <>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.common.white,
            })}
          >
            <PrepareHeader
              assignment={assignment}
              onBack={() => setActiveStep(CallStep.STATS)}
              onStartCall={() => setActiveStep(CallStep.ONGOING)}
            />
          </Box>
          <CallPrepare assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.ONGOING && assignment && (
        <>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.common.white,
            })}
          >
            <OngoingHeader
              assignment={assignment}
              onReportCall={() => setActiveStep(CallStep.REPORT)}
            />
          </Box>
          <CallOngoing assignment={assignment} />
        </>
      )}

      <Box>{children}</Box>
    </Box>
  );
};

export default CallPage;
