import NextLink from 'next/link';
import { Box } from '@mui/material';
import React, { FC, useState } from 'react';
import isEmail from 'validator/lib/isEmail';

import ZUIButton from 'zui/components/ZUIButton';
import ZUIText from 'zui/components/ZUIText';
import ZUITextField from 'zui/components/ZUITextField';
import { useSendPasswordResetToken } from '../hooks/useSendPasswordResetToken';
import ZUIAlert from 'zui/components/ZUIAlert';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import { PasswordResetStatus, PasswordSuccess } from '../types';
import ResponsiveAccountSection from './ResponsiveAccountSection';

type LostPasswordSectionProps = {
  alreadyLoggedIn: boolean;
  onSuccess: (email: string) => void;
  submittedEmail: string | null;
};

const wasSuccessful = (
  result: PasswordResetStatus
): result is PasswordSuccess => {
  return result.success == true;
};

const LostPasswordSection: FC<LostPasswordSectionProps> = ({
  alreadyLoggedIn,
  submittedEmail,
  onSuccess,
}) => {
  const messages = useMessages(messageIds);
  const { sendPasswordResetToken, loading } = useSendPasswordResetToken();
  const [email, setEmail] = useState(submittedEmail || '');
  const [emailError, setEmailError] = useState<
    'unknownError' | 'invalidEmail' | null
  >(null);

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

              if (!isEmail(email)) {
                setEmailError('invalidEmail');
              } else {
                setEmailError(null);

                const result = await sendPasswordResetToken(email);
                if (wasSuccessful(result)) {
                  onSuccess(email);
                } else {
                  setEmailError(result.errorCode);
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
              {alreadyLoggedIn && (
                <ZUIAlert
                  appear
                  description={messages.lostPassword.errors.alreadyLoggedIn.description()}
                  severity={'error'}
                  title={messages.lostPassword.errors.alreadyLoggedIn.title()}
                />
              )}
              <ZUIText variant="bodyMdRegular">
                <Msg id={messageIds.lostPassword.description} />
              </ZUIText>
              {emailError == 'unknownError' && (
                <ZUIAlert
                  appear
                  description={messages.lostPassword.errors.unknownError()}
                  severity={'error'}
                  title={messages.lostPassword.errors.unknownErrorTitle()}
                />
              )}
              <ZUITextField
                disabled={alreadyLoggedIn}
                error={emailError == 'invalidEmail'}
                helperText={
                  emailError == 'invalidEmail'
                    ? messages.lostPassword.errors.invalidEmail()
                    : ''
                }
                label={messages.lostPassword.emailFieldLabel()}
                onChange={(newValue) => {
                  setEmail(newValue);
                  setEmailError(null);
                }}
                size="large"
                value={email}
              />
              <ZUIButton
                actionType="submit"
                disabled={alreadyLoggedIn || loading || !email}
                label={messages.lostPassword.actions.sendEmail()}
                size="large"
                variant={loading ? 'loading' : 'primary'}
              />
            </Box>
          </form>
          {alreadyLoggedIn && (
            <ZUIButton
              disabled
              fullWidth
              label={messages.lostPassword.actions.signIn()}
              size="large"
              variant="secondary"
            />
          )}
          {!alreadyLoggedIn && (
            <NextLink href="/login?redirect=/my">
              <ZUIButton
                disabled={alreadyLoggedIn}
                fullWidth
                label={messages.lostPassword.actions.signIn()}
                size="large"
                variant="secondary"
              />
            </NextLink>
          )}
        </Box>
      )}
      title={messages.lostPassword.title()}
    />
  );
};

export default LostPasswordSection;
