'use client';

import { FC } from 'react';
import { Box } from '@mui/material';

import useCurrentCall from '../hooks/useCurrentCall';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import AboutSection from './AboutSection';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIDivider from 'zui/components/ZUIDivider';
import InstructionsSection from './InstructionsSection';

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
      height="calc(100% - 127px)" //TODO: Change this if/when header height is updated
      maxWidth="100%"
    >
      <Box
        sx={{ flex: 1, height: '100%', maxHeight: '100%', overflowY: 'auto' }}
      >
        <InstructionsSection instructions={assignment.instructions} />
      </Box>
      <ZUIDivider flexItem orientation="vertical" />
      <Box
        sx={{ flex: 1, height: '100%', maxHeight: '100%', overflowY: 'auto' }}
      >
        <AboutSection call={call} />
      </Box>
    </Box>
  );
};

export default CallPrepare;
