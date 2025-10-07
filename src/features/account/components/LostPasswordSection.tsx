import NextLink from 'next/link';
import { Box } from '@mui/material';
import React, { FC, useState } from 'react';

import useIsMobile from 'utils/hooks/useIsMobile';
import ZUIButton from 'zui/components/ZUIButton';
import ZUISection from 'zui/components/ZUISection';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import ZUILogo from 'zui/ZUILogo';
import { useSendPasswordResetToken } from '../hooks/useSendPasswordResetToken';
import ZUIAlert from 'zui/components/ZUIAlert';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import AccountFooter from './AccountFooter';

type LostPasswordSectionProps = {
  onSuccess: (email: string) => void;
  submittedEmail: string | null;
};

const LostPasswordSection: FC<LostPasswordSectionProps> = ({
  submittedEmail,
  onSuccess,
}) => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const { sendPasswordResetToken, loading } = useSendPasswordResetToken();
  const [email, setEmail] = useState(submittedEmail || '');
  const [emailError, setEmailError] = useState<string | null>(null);
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

                if (!email.includes('@')) {
                  setEmailError('INVALID_EMAIL');
                  return;
                }
                setEmailError(null);

                const result = await sendPasswordResetToken(email);
                if (result.success) {
                  onSuccess(email);
                } else {
                  if (result.errorCode == 'USER_NOT_FOUND') {
                    setEmailError('USER_NOT_FOUND');
                  } else {
                    setEmailError('UNKNOWN_ERROR');
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  gap: 2,
                  overflowY: { md: 'visible', xs: 'auto' },
                }}
              >
                <ZUIText variant="bodyMdRegular">
                  <Msg id={messageIds.lostPassword.description} />
                </ZUIText>
                {emailError == 'USER_NOT_FOUND' && (
                  <ZUIAlert
                    appear
                    severity={'error'}
                    title={messages.lostPassword.errors.noUser()}
                  />
                )}
                {emailError == 'UNKNOWN_ERROR' && (
                  <ZUIAlert
                    appear
                    description={messages.lostPassword.errors.unknownError()}
                    severity={'error'}
                    title={messages.lostPassword.errors.unknownErrorTitle()}
                  />
                )}
                {emailError == 'INVALID_EMAIL' && (
                  <ZUIAlert
                    appear
                    description={messages.lostPassword.errors.invalidEmail()}
                    severity={'error'}
                    title={messages.lostPassword.errors.invalidEmailTitle()}
                  />
                )}
                <ZUITextField
                  label={'Email'}
                  onChange={(newValue) => {
                    setEmail(newValue);
                    setEmailError(null);
                  }}
                  size="large"
                  value={email}
                />
                <ZUIButton
                  actionType="submit"
                  disabled={loading || !email}
                  label={messages.lostPassword.actions.sendEmail()}
                  size="large"
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
      title={messages.lostPassword.title()}
    />
  );
};

export default LostPasswordSection;
