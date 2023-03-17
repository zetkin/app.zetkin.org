import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';

type EditWarningCardProps = {
  editing: boolean;
  onToggle: (newValue: boolean) => void;
};

const EditWarningCard: FC<EditWarningCardProps> = ({ editing, onToggle }) => {
  const messages = useMessages(messageIds);

  return (
    <ZUICard
      header={
        editing
          ? messages.editWarning.editing.header()
          : messages.editWarning.locked.header()
      }
      status={editing ? <LockOpen color="warning" /> : <Lock color="success" />}
      subheader={
        editing
          ? messages.editWarning.editing.subheader()
          : messages.editWarning.locked.subheader()
      }
    >
      <Box>
        <Button onClick={() => onToggle(!editing)} variant="outlined">
          {editing
            ? messages.editWarning.editing.lockButton()
            : messages.editWarning.locked.unlockButton()}
        </Button>
      </Box>
    </ZUICard>
  );
};

export default EditWarningCard;
