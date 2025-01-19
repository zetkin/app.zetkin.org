import { FC, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import z from 'zod';
import { ErrorOutlined } from '@mui/icons-material';

import messageIds from 'features/emails/l10n/messageIds';
import { Msg } from 'core/i18n';
import useCurrentUser from 'features/user/hooks/useCurrentUser';
import useSendTestEmail from 'features/emails/hooks/useSendTestEmail';

const emailAddressIsValid = (emailAddress: string): boolean =>
  z.string().email().safeParse(emailAddress).success;

const PreviewTab: FC = () => {
  const user = useCurrentUser();
  const { emailWasSent, isLoading, reset, sendTestEmail } = useSendTestEmail();
  const [emailError, setEmailError] = useState(false);
  const [destinationEmailAddress, setDestinationEmailAddress] = useState('');
  useEffect(() => setDestinationEmailAddress(user?.email ?? ''), [user?.email]);

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
      <TextField
        error={emailError}
        onChange={(ev) => setDestinationEmailAddress(ev.target.value)}
        type="email"
        value={destinationEmailAddress}
      />
      {emailError && (
        <Alert color="error" icon={<ErrorOutlined />}>
          <Typography>
            <Msg
              id={messageIds.editor.settings.tabs.preview.invalidEmailAddress}
            />
          </Typography>
        </Alert>
      )}
      {emailWasSent && (
        <Alert color="success">
          <Typography mb={2}>
            <Msg id={messageIds.editor.settings.tabs.preview.confirmation} />
          </Typography>
          <Button
            color="success"
            onClick={() => reset()}
            size="small"
            variant="outlined"
          >
            <Msg id={messageIds.editor.settings.tabs.preview.okButton} />
          </Button>
        </Alert>
      )}
      {!emailWasSent && (
        <Button
          onClick={() => {
            const emailValid = emailAddressIsValid(destinationEmailAddress);
            setEmailError(!emailValid);
            if (!emailValid) {
              return;
            }
            sendTestEmail({ ...user, email: destinationEmailAddress });
          }}
          variant="contained"
        >
          {isLoading ? (
            <CircularProgress color="inherit" size="1.5rem" />
          ) : (
            <Msg id={messageIds.editor.settings.tabs.preview.sendButton} />
          )}
        </Button>
      )}
    </Box>
  );
};

export default PreviewTab;
