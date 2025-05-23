'use client';

import { FC } from 'react';
import { Box } from '@mui/system';

import ActivitiesSection from './ActivitiesSection';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import InstructionsSection from './InstructionsSection';
import AboutSection from './AboutSection';
import useIsMobile from 'utils/hooks/useIsMobile';

type CallOngoingProps = {
  assignment: ZetkinCallAssignment;
};

const CallOngoing: FC<CallOngoingProps> = ({ assignment }) => {
  assignment;
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
        <ActivitiesSection assignment={assignment} target={call.target} />
      </Box>
      <Box flex={isMobile ? 'none' : '4'} order={isMobile ? 2 : 1} p={2}>
        <AboutSection call={call} />
        <Box mt={2}>
          <InstructionsSection instructions={assignment.instructions} />
        </Box>
      </Box>
    </Box>
  );
};

export default CallOngoing;
