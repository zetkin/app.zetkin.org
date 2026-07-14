'use client';
import { Suspense, useState } from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ResetPasswordSection from 'features/account/components/ResetPasswordSection';
import UpdatedPasswordSection from 'features/account/components/UpdatedPasswordSection';
import ResponsiveAccountSection from 'features/account/components/ResponsiveAccountSection';
import ZUIAlert from 'zui/components/ZUIAlert';
import { useMessages } from 'core/i18n';
import messagesIds from 'features/account/l10n/messageIds';

const ResetPasswordPage = () => {
  const messages = useMessages(messagesIds);
  const searchParams = useSearchParams();
  const rawToken = searchParams?.get('token');
  const userId = rawToken?.includes('$') ? rawToken.split('$')[0] : '';
  const token = rawToken?.split('$')?.[1] || rawToken;
  const [passwordResetWasSuccessful, setPasswordResetWasSuccessful] =
    useState(false);

  if (!token || !userId) {
    return (
      <ResponsiveAccountSection
        renderContent={() => (
          <ZUIAlert
            severity="error"
            title={messages.resetPassword.error.errorMessage()}
          />
        )}
        title={messages.resetPassword.error.title()}
      />
    );
  }

  return (
    <Suspense
      fallback={
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          height="90dvh"
          justifyContent="center"
        >
          <ZUILogoLoadingIndicator />
        </Box>
      }
    >
      {passwordResetWasSuccessful ? (
        <UpdatedPasswordSection />
      ) : (
        <ResetPasswordSection
          onError={() => setPasswordResetWasSuccessful(false)}
          onSuccess={() => setPasswordResetWasSuccessful(true)}
          token={token}
          userId={userId}
        />
      )}
    </Suspense>
  );
};

export default ResetPasswordPage;
