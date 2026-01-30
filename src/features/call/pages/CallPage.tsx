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
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

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
              gap: 1,
              height: '100dvh',
              justifyContent: 'center',
            }}
          >
            <ZUILogo />
            <ZUIText variant="headingMd">
              <Msg id={messageIds.error.title} />
            </ZUIText>
            <ZUIText>
              <Msg id={messageIds.error.description} />
            </ZUIText>
          </Box>
        }
      >
        {canInitialize && <Call />}
      </ErrorBoundary>
    </main>
  );
};

export default CallPage;
