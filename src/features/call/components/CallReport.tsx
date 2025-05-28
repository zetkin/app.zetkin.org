import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import Report from './Report';
import useCallMutations from '../hooks/useCallMutations';
import ZUISection from 'zui/components/ZUISection';

type CallReportProps = {
  assignment: ZetkinCallAssignment;
};

const CallReport: FC<CallReportProps> = ({ assignment }) => {
  const call = useCurrentCall();
  const { updateCall } = useCallMutations(assignment.organization.id);

  if (!call) {
    return null;
  }

  return (
    <Box p={2}>
      <ZUISection
        renderContent={() => (
          <Report
            disableCallerNotes={assignment.disable_caller_notes}
            onReportFinished={(report) => updateCall(call.id, report)}
            target={call.target}
          />
        )}
        title="Report"
      />
    </Box>
  );
};

export default CallReport;
