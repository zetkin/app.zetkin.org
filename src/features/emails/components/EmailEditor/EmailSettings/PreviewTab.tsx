import { FC } from 'react';
import { Box, Button, Typography } from '@mui/material';

import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';
import useCurrentUser from 'features/user/hooks/useCurrentUser';

const PreviewTab: FC = () => {
  const user = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} padding={2}>
      <Typography>
        <Msg id={messageIds.editor.settings.tabs.preview.instructions} />
      </Typography>
      <Typography>
        <Msg id={messageIds.editor.settings.tabs.preview.sendTo} />
      </Typography>
      <Typography>{user.email}</Typography>
      <Button
        onClick={() => {
          //send email
        }}
        variant="contained"
      >
        <Msg id={messageIds.editor.settings.tabs.preview.sendButton} />
      </Button>
    </Box>
  );
};

export default PreviewTab;
