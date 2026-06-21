'use client';

import { Box, Chip } from '@mui/material';
import { FC, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/navigation';

import useServerSide from 'core/useServerSide';
import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import Call from '../components/Call';
import useCallInitialization from '../hooks/useCallInitialization';
import usePBX from '../hooks/usePBX';
import ZUIText from 'zui/components/ZUIText';
import ZUILogo from 'zui/ZUILogo';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

const PBX_CHIP_LABEL: Record<string, string> = {
  connecting: 'PBX: connecting…',
  error: 'PBX: error',
  idle: 'PBX: idle',
  registered: 'PBX: connected',
};

const PBX_CHIP_COLOR: Record<
  string,
  'default' | 'error' | 'success' | 'warning'
> = {
  connecting: 'warning',
  error: 'error',
  idle: 'default',
  registered: 'success',
};

const CallPage: FC = () => {
  const router = useRouter();
  const { clearCallLanes, clearStaleCallLanes, initialize, canInitialize } =
    useCallInitialization();
  const { status: pbxStatus, callStatus, invite, hangup } = usePBX();

  useEffect(() => {
    if (canInitialize) {
      initialize();
    } else {
      clearStaleCallLanes();
      return redirect('/my');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <main style={{ position: 'relative' }}>
      <Chip
        color={PBX_CHIP_COLOR[pbxStatus]}
        label={PBX_CHIP_LABEL[pbxStatus]}
        size="small"
        sx={{ position: 'fixed', right: 12, top: 12, zIndex: 9999 }}
        variant="outlined"
      />
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
        {canInitialize && (
          <Call
            callStatus={callStatus}
            clearCallLanes={() => clearCallLanes()}
            hangup={hangup}
            invite={invite}
            onResetAfterError={(urlToNavigateTo: string) => {
              clearCallLanes();
              router.push(urlToNavigateTo);
            }}
          />
        )}
      </ErrorBoundary>
    </main>
  );
};

export default CallPage;
