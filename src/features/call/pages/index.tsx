'use client';

import { Box } from '@mui/material';
import { FC, ReactNode, useState } from 'react';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import PrepareHeader from '../components/PrepareHeader';
import StatsHeader from '../components/StatsHeader';
import AssignmentStatsPage from './AssignmentStatsPage';
import AssignmentPreparePage from './AssignmentPreparePage';
import AssignmentOngoingPage from './AssignmentOngoingPage';
import OnCallHeader from '../components/OnCallHeader';

type Props = {
  callAssId: string;
  children?: ReactNode;
};

export enum CallStep {
  LOBBY = 0,
  PREPARE = 1,
  CALLING = 2,
  REPORT = 3,
}

const CallPage: FC<Props> = ({ callAssId, children }) => {
  const [activeStep, setActiveStep] = useState<CallStep>(CallStep.LOBBY);
  const assignments = useMyCallAssignments();
  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  return (
    <Box>
      {activeStep == CallStep.LOBBY && assignment && (
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
          <AssignmentStatsPage assignment={assignment} />
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
              onStartCall={() => setActiveStep(CallStep.CALLING)}
            />
          </Box>
          <AssignmentPreparePage assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.CALLING && assignment && (
        <>
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.common.white,
            })}
          >
            <OnCallHeader
              assignment={assignment}
              onReportCall={() => setActiveStep(CallStep.REPORT)}
            />
          </Box>
          <AssignmentOngoingPage assignment={assignment} />
        </>
      )}

      <Box>{children}</Box>
    </Box>
  );
};

export default CallPage;
