'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import LostPasswordSection from '../components/LostPasswordSection';
import CheckEmailSection from '../components/CheckEmailSection';
import useUser from 'core/hooks/useUser';

const LostPasswordPage: FC = () => {
  const user = useUser();

  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const isLoggedIn = !!user;
  const showEnterEmailForm = !success && !submittedEmail;
  const passwordEmailHasBeenSent = !isLoggedIn && success && !!submittedEmail;

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
      {showEnterEmailForm && (
        <LostPasswordSection
          alreadyLoggedIn={isLoggedIn}
          onSuccess={(email) => {
            setSubmittedEmail(email);
            setSuccess(true);
          }}
          submittedEmail={submittedEmail}
        />
      )}
      {passwordEmailHasBeenSent && (
        <CheckEmailSection
          email={submittedEmail}
          onBack={(email) => {
            setSuccess(false);
            setSubmittedEmail(email);
          }}
        />
      )}
    </Suspense>
  );
};

export default LostPasswordPage;
