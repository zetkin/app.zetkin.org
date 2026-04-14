'use client';

import { Box } from '@mui/material';

import { useMessages } from 'core/i18n';
import messageIds from 'core/l10n/messageIds';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';

export default function MyNotFound() {
  const messages = useMessages(messageIds);

  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        justifyContent: 'center',
        minHeight: '50dvh',
        px: 2,
      }}
    >
      <ZUIText color="secondary" variant="headingLg">
        404
      </ZUIText>
      <ZUIText variant="headingMd">{messages.err404.pageNotFound()}</ZUIText>
      <Box mt={2}>
        <ZUIButton
          href="/my/home"
          label={messages.err404.backToHomePage()}
          variant="tertiary"
        />
      </Box>
    </Box>
  );
}
