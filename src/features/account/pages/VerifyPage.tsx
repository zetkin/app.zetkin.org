'use client';

import { FC, Suspense, useState } from 'react';
import { Box } from '@mui/material';

import ZUILogoLoadingIndicator from 'zui/ZUILogoLoadingIndicator';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messagesIds';
import messagesIds from '../l10n/messagesIds';
import { UseSendVerification } from '../hooks/useSendVerification';
import ZUIAlert from 'zui/components/ZUIAlert';
import { SendFail, SendVerificationStatus } from '../types';
import ResponsiveAccountSection from '../components/ResponsiveAccountSection';

const hasError = (result: SendVerificationStatus): result is SendFail => {
  return 'errorCode' in result;
};

const VerifyPage: FC = () => {
  const messages = useMessages(messageIds);
  const { loading, sendVerification } = UseSendVerification();
  const [error, setError] = useState(false);

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
      <ResponsiveAccountSection
        renderContent={() => (
          <form
            onSubmit={async (ev) => {
              ev.preventDefault();

              const result = await sendVerification();

              if (hasError(result)) {
                setError(true);
              }
            }}
          >
            <Box display="flex" flexDirection="column" gap={1}>
              <ZUIText>
                <Msg id={messagesIds.verify.description} />
              </ZUIText>
              {error && (
                <ZUIAlert severity={'error'} title={messages.verify.error()} />
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
        )}
        title={messages.verify.title()}
      />
    </Suspense>
  );
};

export default VerifyPage;
