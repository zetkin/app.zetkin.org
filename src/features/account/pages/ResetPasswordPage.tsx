'use client';
import { Suspense, useState } from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ResetPasswordSection from '../components/ResetPasswordSection';
import UpdatedPasswordSection from '../components/UpdatedPasswordSection';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const rawToken = searchParams?.get('token');
  const userId = rawToken?.split('$')[0];
  const token = rawToken?.includes('$') ? rawToken.split('$')[1] : rawToken;
  const [success, setSuccess] = useState(true);

  if (!token || !userId) {
    return null;
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
      {success ? (
        <ResetPasswordSection
          onSuccess={() => setSuccess(false)}
          token={token}
          userId={userId}
        />
      ) : (
        <UpdatedPasswordSection />
      )}
    </Suspense>
  );
};

export default ResetPasswordPage;
