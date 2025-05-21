import { FC } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import useCurrentCall from '../hooks/useCurrentCall';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import useAllocateCall from '../hooks/useAllocateCall';

type CallSummaryProps = {
  assignment: ZetkinCallAssignment;
  onSummarize: () => void;
};

const CallSummary: FC<CallSummaryProps> = ({ assignment, onSummarize }) => {
  const call = useCurrentCall();
  const { allocateCall } = useAllocateCall(
    assignment.organization.id,
    assignment.id
  );

  if (!call) {
    return null;
  }

  return (
    <Box gap={2} p={2}>
      <ZUIText>Wohooo keep calling</ZUIText>
      <ZUIButton
        label="keep calling"
        onClick={() => {
          onSummarize();
          allocateCall();
        }}
        variant="primary"
      />
    </Box>
  );
};

export default CallSummary;
