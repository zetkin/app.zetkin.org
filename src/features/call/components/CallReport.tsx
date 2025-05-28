import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportForm from './Report';
import ZUISection from 'zui/components/ZUISection';
import { useAppDispatch } from 'core/hooks';
import { reportAdded } from '../store';

type CallReportProps = {
  assignment: ZetkinCallAssignment;
};

const CallReport: FC<CallReportProps> = ({ assignment }) => {
  const call = useCurrentCall();
  const dispatch = useAppDispatch();

  if (!call) {
    return null;
  }

  return (
    <Box p={2}>
      <ZUISection
        renderContent={() => (
          <ReportForm
            disableCallerNotes={assignment.disable_caller_notes}
            onReportFinished={(report) => {
              dispatch(reportAdded([call.id, report]));
            }}
            target={call.target}
          />
        )}
        title="Report"
      />
    </Box>
  );
};

export default CallReport;
