import { FC, useState } from 'react';
import { Box } from '@mui/material';
import NextLink from 'next/link';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import ZUISection from 'zui/components/ZUISection';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import useIsMobile from 'utils/hooks/useIsMobile';
import AccountFooter from './AccountFooter';
import ZUILogo from 'zui/ZUILogo';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUITextField from 'zui/components/ZUITextField';
import { UseSetPasswordResetToken } from '../hooks/useSetPasswordResetToken';
import ZUIAlert from 'zui/components/ZUIAlert';

type ResetPasswordSectionProps = {
  onSuccess: () => void;
  token: string;
  userId: string;
};

const ResetPasswordSection: FC<ResetPasswordSectionProps> = ({
  onSuccess,
  token,
  userId,
}) => {
  const messages = useMessages(messageIds);
  const isMobile = useIsMobile();
  const { loading, resetPassword } = UseSetPasswordResetToken(token, userId);
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  return (
    <ZUISection
      borders={isMobile ? false : true}
      fullHeight
      renderContent={() => {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <form
              onSubmit={async (ev) => {
                ev.preventDefault();
                if (newPassword.length < 6) {
                  setPasswordError(true);
                } else {
                  await resetPassword(newPassword);
                  onSuccess();
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
                <ZUIText variant="bodyMdRegular">
                  <Msg id={messageIds.resetPassword.description} />
                </ZUIText>
                {passwordError && (
                  <ZUIAlert
                    severity={'error'}
                    title={messages.resetPassword.validation()}
                  />
                )}
                <ZUITextField
                  endIcon={showPassword ? VisibilityOff : Visibility}
                  fullWidth
                  label={messages.resetPassword.actions.labelPassword()}
                  onChange={(newValue) => {
                    setNewPassword(newValue);
                    setPasswordError(false);
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
            <Box
              sx={{
                bottom: { md: 'auto', xs: 0 },
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                left: { md: 'auto', xs: 0 },
                mt: { md: 25, xs: 0 },
                position: { md: 'static', xs: 'absolute' },
                px: isMobile ? 2 : 0,
                py: isMobile ? 2 : 0,
                right: { md: 'auto', xs: 0 },
              }}
            >
              <NextLink href={`https://login.zetk.in/`}>
                <ZUIButton
                  fullWidth
                  label={messages.lostPassword.actions.signIn()}
                  size="large"
                  variant="secondary"
                />
              </NextLink>
              <AccountFooter />
            </Box>
          </Box>
        );
      }}
      renderRightHeaderContent={() => {
        return <ZUILogo />;
      }}
      title={messages.resetPassword.title()}
    />
  );
};

export default ResetPasswordSection;
