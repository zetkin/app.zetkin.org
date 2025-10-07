'use client';

import { Box } from '@mui/material';
import { FC, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';

import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import Call from '../components/Call';
import useCallInitialization from '../hooks/useCallInitialization';
import ZUIText from 'zui/components/ZUIText';
import ZUILogo from 'zui/ZUILogo';

const CallPage: FC = () => {
  const { initialize, canInitialize } = useCallInitialization();

  useEffect(() => {
    if (canInitialize) {
      initialize();
    } else {
      return redirect('/my');
    }
  }, []);

  const onServer = useServerSide();

  if (onServer) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          height: '100dvh',
          justifyContent: 'center',
        }}
      >
        <ZUILogoLoadingIndicator />
      </Box>
    );
  }

  return (
    <main>
      <ErrorBoundary
        fallback={
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: '100dvh',
              justifyContent: 'center',
            }}
          >
            <ZUILogo />
            <ZUIText variant="headingMd">An unexpected error occured.</ZUIText>
            <ZUIText>
              Try refreshing the page. If error persists - try logging out and
              then in again. If error still persists, contact support.
            </ZUIText>
          </Box>
        }
      >
        <Call />
      </ErrorBoundary>
    </main>
  );
};

export default CallPage;
