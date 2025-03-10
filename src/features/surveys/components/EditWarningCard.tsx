import { FC } from 'react';
import { Box, Divider, Switch, Typography, useTheme } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ZUICard from 'zui/ZUICard';

type EditWarningCardProps = {
  editing: boolean;
  onToggle: (newValue: boolean) => void;
};

const EditWarningCard: FC<EditWarningCardProps> = ({ editing, onToggle }) => {
  const messages = useMessages(messageIds);
  const theme = useTheme();

  return (
    <ZUICard
      header={
        editing
          ? messages.editWarning.editing.header()
          : messages.editWarning.locked.header()
      }
      status={<Switch checked={!editing} onChange={() => onToggle(!editing)} />}
      subheader={
        editing
          ? messages.editWarning.editing.subheader()
          : messages.editWarning.locked.subheader()
      }
    >
      <Box>
        {editing && (
          <>
            <Divider />
            <Box marginTop={3}>
              <EditTips
                bullets={[
                  messages.editWarning.editing.safe.bullet1(),
                  messages.editWarning.editing.safe.bullet2(),
                  messages.editWarning.editing.safe.bullet3(),
                  messages.editWarning.editing.safe.bullet4(),
                ]}
                header={messages.editWarning.editing.safe.header()}
                icon={<Check style={{ color: theme.palette.success.main }} />}
              />
              <EditTips
                bullets={[
                  messages.editWarning.editing.unsafe.bullet1(),
                  messages.editWarning.editing.unsafe.bullet2(),
                ]}
                header={messages.editWarning.editing.unsafe.header()}
                icon={<Close color="error" />}
              />
            </Box>
          </>
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
      <Box>
        <Typography>{header}</Typography>
        <Typography style={{ marginTop: 2 }}>
          {bullets.map((bullet) => (
            <Box key={bullet} alignItems="flex-start" display="flex">
              <Box mr={1}>{icon}</Box>
              <Typography>{bullet}</Typography>
            </Box>
          ))}
        </Typography>
      </Box>
    </Box>
  );
};

export default EditWarningCard;
