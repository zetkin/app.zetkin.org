import React, { FC, useState } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PreviousCallsSection from './PreviousCallsSection';
import ZUIModal from 'zui/components/ZUIModal';
import PreviousCallsSearch from './PreviousCallsSearch';

type CallSwitchModalProps = {
  assignment: ZetkinCallAssignment;
  onClose: () => void;
  onSwitchCall: () => void;
  open: boolean;
};

const CallSwitchModal: FC<CallSwitchModalProps> = ({
  assignment,
  onSwitchCall,
  onClose,
  open,
}) => {
  const [debouncedInput, setDebouncedInput] = useState<string>('');

  return (
    <ZUIModal
      open={open}
      primaryButton={{
        label: 'Close',
        onClick: () => {
          onClose();
        },
      }}
      title="Your calls"
    >
      <Box
        display="flex"
        flexDirection="column"
        sx={{
          overflowX: 'hidden',
          width: '100%',
        }}
      >
        <Box mt={2}>
          <PreviousCallsSearch
            onDebouncedChange={(value) => {
              setDebouncedInput(value);
            }}
          />
        </Box>
        <PreviousCallsSection
          assingmentId={assignment.id}
          onClose={onClose}
          onSwitchCall={onSwitchCall}
          orgId={assignment.organization.id}
          searchTerm={debouncedInput}
        />
      </Box>
    </ZUIModal>
  );
};

export default CallSwitchModal;
