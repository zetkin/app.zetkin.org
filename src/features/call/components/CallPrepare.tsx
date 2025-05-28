'use client';

import { FC } from 'react';
import { Box } from '@mui/material';

import useCurrentCall from '../hooks/useCurrentCall';
import InstructionsSection from './InstructionsSection';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import AboutSection from './AboutSection';
import useIsMobile from 'utils/hooks/useIsMobile';

type CallPrepareProps = {
  assignment: ZetkinCallAssignment;
};

const CallPrepare: FC<CallPrepareProps> = ({ assignment }) => {
  const call = useCurrentCall();
  const isMobile = useIsMobile();

  if (!call) {
    return null;
  }

  return (
    <Box
      display="flex"
      flexDirection={isMobile ? 'column' : 'row'}
      width="100%"
    >
      <Box flex={isMobile ? 'none' : '6'} order={isMobile ? 1 : 2} p={2}>
        <AboutSection call={call} />
      </Box>

      <Box flex={isMobile ? 'none' : '4'} order={isMobile ? 2 : 1} p={2}>
        <InstructionsSection instructions={assignment.instructions} />
      </Box>
    </Box>
  );
};

export default CallPrepare;
