import { Box } from '@mui/material';
import { FC, useState } from 'react';

import { useMessages } from 'core/i18n';
import { ZetkinUser } from 'utils/types/zetkin';
import messageIds from '../l10n/messageIds';
import useUserMutations from 'features/public/hooks/useUserMutations';
import ZUISection from 'zui/components/ZUISection';
import ZUITextField from 'zui/components/ZUITextField';
import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';

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
        <ZUISection
          renderContent={() => (
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
                  gap: '1rem',
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <ZUIText>
                    {user.email
                      ? messages.settings.accountSettings.email.changeInstructions()
                      : messages.settings.accountSettings.email.addInstructions()}
                  </ZUIText>
                </Box>
                <ZUITextField
                  disabled={!!user.email}
                  error={error}
                  fullWidth
                  helperText={
                    error
                      ? messages.settings.accountSettings.email.errorText()
                      : ''
                  }
                  label={messages.settings.accountSettings.email.label()}
                  onChange={(newValue) => setEmail(newValue)}
                  size="large"
                  type="email"
                  value={email}
                />
                <Box sx={{ alignSelf: 'flex-end' }}>
                  <ZUIButton
                    actionType="submit"
                    disabled={
                      savingEmail || !email.length || email == user.email
                    }
                    label={messages.settings.accountSettings.email.saveButton()}
                    size="large"
                    variant="primary"
                  />
                </Box>
              </Box>
            </form>
          )}
          title={messages.settings.accountSettings.header()}
        />
      </Box>
    </Box>
  );
};

export default AccountSettings;
