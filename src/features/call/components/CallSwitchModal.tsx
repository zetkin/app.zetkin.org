import React, { FC, useState } from 'react';
import { Box } from '@mui/material';

import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PreviousCallsSection from './PreviousCallsSection';
import ZUIModal from 'zui/components/ZUIModal';
import PreviousCallsSearch from './PreviousCallsSearch';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';

type CallSwitchModalProps = {
  assignment: ZetkinCallAssignment;
  onClose: () => void;
  onSwitch: (assignmentId: number) => void;
  open: boolean;
};

const CallSwitchModal: FC<CallSwitchModalProps> = ({
  assignment,
  onClose,
  onSwitch,
  open,
}) => {
  const messages = useMessages(messageIds);
  const [debouncedInput, setDebouncedInput] = useState<string>('');

  return (
    <ZUIModal
      onClose={() => {
        setDebouncedInput('');
        onClose();
      }}
      open={open}
      size="medium"
      title={messages.callLog.title()}
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
          onCall={(assignmentId) => {
            onSwitch(assignmentId);
            onClose();
          }}
          orgId={assignment.organization.id}
          searchTerm={debouncedInput}
        />
      </Box>
    </ZUIModal>
  );
};

export default CallSwitchModal;
