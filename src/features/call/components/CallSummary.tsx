import { FC } from 'react';
import { Box } from '@mui/material';

import AssignmentStats from './AssignmentStats';
import useSimpleCallAssignmentStats from '../hooks/useSimpleCallAssignmentStats';
import { ZetkinCallAssignment } from 'utils/types/zetkin';

type Props = {
  assignment: ZetkinCallAssignment;
};

const CallSummary: FC<Props> = ({ assignment }) => {
  const stats = useSimpleCallAssignmentStats(
    assignment.organization.id,
    assignment.id
  );
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <Box sx={{ minWidth: '50%' }}>
        <AssignmentStats stats={stats} />
      </Box>
    </Box>
  );
};

export default CallSummary;
