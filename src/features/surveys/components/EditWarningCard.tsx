import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Lock, LockOpen, ThumbDown, ThumbUp } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/newDesignSystem/ZUICard';

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
        {editing && (
          <Box marginTop={3}>
            <EditTips
              bullets={[
                messages.editWarning.editing.safe.bullet1(),
                messages.editWarning.editing.safe.bullet2(),
                messages.editWarning.editing.safe.bullet3(),
                messages.editWarning.editing.safe.bullet4(),
              ]}
              header={messages.editWarning.editing.safe.header()}
              icon={<ThumbUp color="success" />}
            />
            <EditTips
              bullets={[
                messages.editWarning.editing.unsafe.bullet1(),
                messages.editWarning.editing.unsafe.bullet2(),
              ]}
              header={messages.editWarning.editing.unsafe.header()}
              icon={<ThumbDown color="warning" />}
            />
          </Box>
        )}
      </Box>
    </ZUICard>
  );
};

const EditTips: FC<{
  bullets: string[];
  header: string;
  icon: JSX.Element;
}> = ({ bullets, header, icon }) => {
  return (
    <Box display="flex" gap={2} marginTop={1}>
      <Box>{icon}</Box>
      <Box>
        <Typography fontWeight="bold">{header}</Typography>
        <ul style={{ marginTop: 0, paddingLeft: 16 }}>
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default EditWarningCard;
