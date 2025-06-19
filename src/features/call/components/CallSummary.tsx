import { FC } from 'react';
import { Box } from '@mui/material';

import AssignmentStats from './AssignmentStats';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import CallSummarySentence from './CallSummarySentence';
import { ZetkinCall } from '../types';
import useIsMobile from 'utils/hooks/useIsMobile';

type Props = {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
};

const CallSummary: FC<Props> = ({ assignment, call }) => {
  const isMobile = useIsMobile();
  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minWidth: isMobile ? '100%' : '600px',
        }}
      >
        <CallSummarySentence call={call} />
        <AssignmentStats stats={stats} />
      </Box>
    </Box>
  );
};

export default CallSummary;
