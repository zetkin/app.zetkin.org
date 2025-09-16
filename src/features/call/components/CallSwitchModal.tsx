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
      onClose={() => {
        setDebouncedInput('');
        onClose();
      }}
      open={open}
      size="medium"
      title="Call log"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          paddingRight: 1,
          paddingTop: 2,
          width: '100%',
        }}
      >
        <PreviousCallsSearch
          onDebouncedChange={(value) => {
            setDebouncedInput(value);
          }}
        />
        <PreviousCallsSection
          assingmentId={assignment.id}
          onCall={() => onClose()}
          orgId={assignment.organization.id}
          searchTerm={debouncedInput}
        />
      </Box>
    </ZUIModal>
  );
};

export default CallSwitchModal;
