import React, { FC } from 'react';
import { Box } from '@mui/material';
import { Search } from '@mui/icons-material';

import ZUIAlert from 'zui/components/ZUIAlert';
import ZUITextField from 'zui/components/ZUITextField';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import PreviousCallsSection from './PreviousCallsSection';
import ZUIModal from 'zui/components/ZUIModal';
import useIsMobile from 'utils/hooks/useIsMobile';

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
  const isMobile = useIsMobile();
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
        {!isMobile && (
          <Box my={2}>
            <ZUIAlert
              button={{
                label: 'Show unfinished calls',
                onClick: () => {},
              }}
              description="Placeholder for future description"
              severity={'info'}
              title={'Title'}
            />
          </Box>
        )}
        <Box mt={isMobile ? 2 : 0}>
          <ZUITextField fullWidth label="Type to find" startIcon={Search} />
        </Box>
        <PreviousCallsSection
          assingmentId={assignment.id}
          onClose={onClose}
          orgId={assignment.organization.id}
        />
      </Box>
    </ZUIModal>
  );
};

export default CallSwitchModal;
