import React, { FC, useState } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PreviousCallsSection from './PreviousCallsSection';
import ZUIModal from 'zui/components/ZUIModal';
import PreviousCallsSearch from './PreviousCallsSearch';

type CallSwitchModalProps = {
  assignment: ZetkinCallAssignment;
  onClose: () => void;
  open: boolean;
};

const CallSwitchModal: FC<CallSwitchModalProps> = ({
  assignment,
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
        <Box mb={1} mt={3}>
          <PreviousCallsSearch
            onDebouncedChange={(value) => {
              setDebouncedInput(value);
            }}
          />
        </Box>
        <PreviousCallsSection
          assingmentId={assignment.id}
          onClose={onClose}
          orgId={assignment.organization.id}
          searchTerm={debouncedInput}
        />
      </Box>
    </ZUIModal>
  );
};

export default CallSwitchModal;
