'use client';

import { FC } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/system';

import ActivitiesSection from '../components/ActivitiesSection';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import TargetInfo from '../components/TargetInfo';
import ZUISection from 'zui/components/ZUISection';
import InstructionsSection from '../components/InstructionsSection';

type AssignmentOngoingPageProps = {
  assignment: ZetkinCallAssignment;
};

const AssignmentOngoingPage: FC<AssignmentOngoingPageProps> = ({
  assignment,
}) => {
  assignment;
  const call = useCurrentCall();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        <ZUISection
          renderContent={() => <TargetInfo call={call} />}
          title={`About ${call.target.first_name} ${call.target.last_name}`}
        />
        <Box mt={2}>
          <InstructionsSection instructions={assignment.instructions} />
        </Box>
      </Box>
    </Box>
  );
};

export default AssignmentOngoingPage;
