'use client';

import { Box } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from 'core/l10n/messageIds';
import HomeThemeProvider from 'features/my/components/HomeThemeProvider';
import ActivistPortalHeader from 'features/public/components/ActivistPortalHeader';
import ZUIPublicFooter from 'zui/components/ZUIPublicFooter';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUILogo from 'zui/ZUILogo';

export default function CanvassNotFound() {
  const messages = useMessages(messageIds);

  return (
    <HomeThemeProvider>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginX: 'auto',
          maxWidth: 960,
          minHeight: '100dvh',
        }}
      >
        <ActivistPortalHeader topLeftComponent={<ZUILogo />} />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: 1,
            justifyContent: 'center',
            px: 2,
          }}
        >
          <ZUIText color="secondary" variant="headingLg">
            404
          </ZUIText>
          <ZUIText variant="headingMd">
            {messages.err404.assignmentNotFound()}
          </ZUIText>
          <Box mt={2}>
            <ZUIButton
              href="/my"
              label={messages.err404.goToMyZetkin()}
              variant="tertiary"
            />
          </Box>
        </Box>
        <ZUIPublicFooter />
      </Box>
    </HomeThemeProvider>
  );
}
