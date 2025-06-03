import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ReportCall from './ReportCall';
import useCurrentCall from '../hooks/useCurrentCall';

type CallReportProps = {
  assignment: ZetkinCallAssignment;
  onSummarize: () => void;
};

const CallReport: FC<CallReportProps> = ({ assignment, onSummarize }) => {
  const call = useCurrentCall();

  if (!call) {
    return null;
  }

  return (
    <Box p={2}>
      <ReportCall
        call={call}
        onSummarize={onSummarize}
        orgId={assignment.organization.id}
      />
    </Box>
  );
};

export default CallReport;
