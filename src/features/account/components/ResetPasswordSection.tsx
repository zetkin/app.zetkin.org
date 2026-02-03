import { FC, useState } from 'react';
import { Box } from '@mui/material';
import NextLink from 'next/link';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUITextField from 'zui/components/ZUITextField';
import { useSetPasswordResetToken } from '../hooks/useSetPasswordResetToken';
import ZUIAlert from 'zui/components/ZUIAlert';
import ResponsiveAccountSection from './ResponsiveAccountSection';

type ResetPasswordSectionProps = {
  onError: () => void;
  onSuccess: () => void;
  token: string;
  userId: string;
};

const ResetPasswordSection: FC<ResetPasswordSectionProps> = ({
  onError,
  onSuccess,
  token,
  userId,
}) => {
  const messages = useMessages(messageIds);
  const { loading, resetPassword } = useSetPasswordResetToken(token, userId);

  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFormatError, setPasswordFormatError] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(false);

  return (
    <ResponsiveAccountSection
      renderContent={() => (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            paddingBottom: 2,
          }}
        >
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();
              setPasswordResetError(false);
              if (newPassword.length < 6) {
                setPasswordFormatError(true);
              } else {
                const result = await resetPassword(newPassword);
                if (result.success) {
                  onSuccess();
                } else {
                  onError();
                  setPasswordResetError(true);
                }
              }
            }}
          >
            <Box
              sx={{
                alignItems: 'left',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 2,
                justifyContent: 'center',
              }}
            >
              {passwordResetError && (
                <ZUIAlert
                  severity="error"
                  title={messages.resetPassword.unexpectedError()}
                />
              )}
              {passwordFormatError && (
                <ZUIAlert
                  severity="error"
                  title={messages.resetPassword.validation()}
                />
              )}
              <ZUIText variant="bodyMdRegular">
                <Msg id={messageIds.resetPassword.description} />
              </ZUIText>
              <ZUITextField
                endIcon={showPassword ? VisibilityOff : Visibility}
                fullWidth
                label={messages.resetPassword.actions.labelPassword()}
                onChange={(newValue) => {
                  setNewPassword(newValue);
                  setPasswordFormatError(false);
                }}
                onEndIconClick={() => setShowPassword((prev) => !prev)}
                size="large"
                type={showPassword ? 'text' : 'password'}
              />
              <ZUIButton
                actionType="submit"
                disabled={loading || !newPassword}
                fullWidth
                label={messages.resetPassword.actions.save()}
                variant={loading ? 'loading' : 'primary'}
              />
            </Box>
          </form>
          <NextLink href="/login" passHref>
            <ZUIButton
              fullWidth
              label={messages.lostPassword.actions.signIn()}
              size="large"
              variant="secondary"
            />
          </NextLink>
        </Box>
      )}
      title={messages.resetPassword.title()}
    />
  );
};

export default ResetPasswordSection;
