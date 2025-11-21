import { OpenInNew } from '@mui/icons-material';
import { Box, Link, useTheme } from '@mui/material';
import React from 'react';

import { PlainMessage } from 'core/i18n/messages';
import { HookedMessageFunc } from 'core/i18n/useMessages';
import ZUICard from 'zui/ZUICard';
import ZUITextfieldToClipboard from 'zui/ZUITextfieldToClipboard';

type ZUIURLCardProps = {
  absoluteUrl: string;
  isOpen: boolean;
  messages: {
    nowAccepting: HookedMessageFunc<PlainMessage>;
    open: HookedMessageFunc<PlainMessage>;
    preview: HookedMessageFunc<PlainMessage>;
    previewPortal: HookedMessageFunc<PlainMessage>;
    visitPortal: HookedMessageFunc<PlainMessage>;
    willAccept: HookedMessageFunc<PlainMessage>;
  };
  relativeUrl: string;
};

const ZUIURLCard: React.FC<ZUIURLCardProps> = ({
  absoluteUrl,
  isOpen,
  messages,
  relativeUrl,
}) => {
  const theme = useTheme();

  return (
    <ZUICard
      header={isOpen ? messages.open() : messages.preview()}
      status={
        <Box
          sx={{
            backgroundColor: isOpen
              ? theme.palette.success.main
              : theme.palette.grey['500'],
            borderRadius: 5,
            height: 20,
            width: 20,
          }}
        />
      }
      subheader={isOpen ? messages.nowAccepting() : messages.willAccept()}
    >
      <Box display="flex" paddingBottom={2}>
        <ZUITextfieldToClipboard copyText={absoluteUrl}>
          {absoluteUrl}
        </ZUITextfieldToClipboard>
      </Box>
      <Link
        display="flex"
        href={relativeUrl}
        sx={{ alignItems: 'center', gap: 1 }}
        target="_blank"
      >
        <OpenInNew fontSize="inherit" />
        {isOpen ? messages.visitPortal() : messages.previewPortal()}
      </Link>
    </ZUICard>
  );
};

export default ZUIURLCard;
