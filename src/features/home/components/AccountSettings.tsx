import { Box, Button, Divider, TextField, Typography } from '@mui/material';
import { FC, useState } from 'react';

import { Msg, useMessages } from 'core/i18n';
import { ZetkinUser } from 'utils/types/zetkin';
import ZUICard from 'zui/ZUICard';
import messageIds from '../l10n/messageIds';
import useUserMutations from '../hooks/useUserMutations';

type Props = {
  user: ZetkinUser;
};

const AccountSettings: FC<Props> = ({ user }) => {
  const [email, setEmail] = useState(user.email || '');
  const [error, setError] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const messages = useMessages(messageIds);
  const { updateUser } = useUserMutations();

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      overflow="hidden"
      position="relative"
    >
      <Box mt={2}>
        <ZUICard header={messages.settings.accountSettings.header()}>
          <Divider />
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();

              setError(false);
              setSavingEmail(true);
              try {
                await updateUser({ email });
              } catch (err) {
                setError(true);
              } finally {
                setSavingEmail(false);
              }
            }}
          >
            <Box
              sx={{
                alignItems: 'flex-end',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                my: 2,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography>
                  {user.email
                    ? messages.settings.accountSettings.email.changeInstructions()
                    : messages.settings.accountSettings.email.addInstructions()}
                </Typography>
              </Box>
              <TextField
                disabled={!!user.email}
                error={error}
                fullWidth
                helperText={
                  error
                    ? messages.settings.accountSettings.email.errorText()
                    : ''
                }
                label={messages.settings.accountSettings.email.label()}
                onChange={(ev) => setEmail(ev.target.value)}
                type="email"
                value={email}
              />
              <Button
                disabled={savingEmail || !email.length || email == user.email}
                type="submit"
                variant="contained"
              >
                <Msg
                  id={messageIds.settings.accountSettings.email.saveButton}
                />
              </Button>
            </Box>
          </form>
        </ZUICard>
      </Box>
    </Box>
  );
};

export default AccountSettings;
