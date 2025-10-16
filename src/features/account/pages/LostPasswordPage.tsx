'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import LostPasswordSection from '../components/LostPasswordSection';
import CheckEmailSection from '../components/CheckEmailSection';

const LostPasswordPage: FC = () => {
  const [success, setSuccess] = useState(true);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
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
      {success && submittedEmail ? (
        <CheckEmailSection
          email={submittedEmail}
          onBack={(email) => {
            setSuccess(false), setSubmittedEmail(email);
          }}
        />
      ) : (
        <LostPasswordSection
          onSuccess={(email) => {
            setSubmittedEmail(email);
            setSuccess(true);
          }}
          submittedEmail={submittedEmail}
        />
      )}
    </Suspense>
  );
};

export default LostPasswordPage;
