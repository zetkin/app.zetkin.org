'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';
import NextLink from 'next/link';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUISection from 'zui/components/ZUISection';
import useIsMobile from 'utils/hooks/useIsMobile';
import ZUILogo from 'zui/ZUILogo';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import AccountFooter from '../components/AccountFooter';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import messagesIds from '../l10n/messagesIds';
import { UseSendVerification } from '../hooks/useSendVerification';
import ZUIAlert from 'zui/components/ZUIAlert';

const VerifyPage: FC = () => {
  const isMobile = useIsMobile();
  const messages = useMessages(messageIds);
  const { loading, sendVerification } = UseSendVerification();
  const [error, setError] = useState<string | null>(null);

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
      <ZUISection
        borders={isMobile ? false : true}
        fullHeight
        renderContent={() => {
          return (
            <>
              <form
                onSubmit={async (ev) => {
                  ev.preventDefault();

                  const result = await sendVerification();
                  if (result.errorCode) {
                    setError('UNKNOWN_ERROR');
                  }
                }}
              >
                <Box display="flex" flexDirection="column" gap={1}>
                  <ZUIText>
                    <Msg id={messagesIds.verify.description} />
                  </ZUIText>
                  {error && (
                    <ZUIAlert
                      severity={'error'}
                      title={messages.verify.error()}
                    />
                  )}
                  <ZUIButton
                    actionType="submit"
                    disabled={loading}
                    fullWidth
                    label={messages.verify.sendVerification()}
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
                <AccountFooter />
              </Box>
            </>
          );
        }}
        renderRightHeaderContent={() => {
          return <ZUILogo />;
        }}
        title={messages.verify.title()}
      />
    </Suspense>
  );
};

export default VerifyPage;
