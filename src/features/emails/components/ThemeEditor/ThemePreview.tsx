import React, { useEffect, useState } from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { EmailTheme } from 'features/emails/types';
import previewEmailThemeHtml from 'features/emails/utils/rendering/previewEmailThemeHtml';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import usePreviewEmailTheme from 'features/emails/hooks/usePreviewEmailTheme';

interface ThemePreviewProps {
  theme: EmailTheme | null;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const messages = useMessages(messageIds);
  const content = usePreviewEmailTheme();
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (!theme) {
      return;
    }
    previewEmailThemeHtml(content, theme).then((html) => {
      setPreviewHtml(html);
    });
  });

  return (
    <Stack sx={{ flex: 1, height: '100%', minWidth: '0' }}>
      <Box
        sx={{
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          height: '49px',
          px: 2,
        }}
      >
        <Typography sx={{ fontWeight: 500 }} variant="subtitle1">
          {messages.themes.themeEditor.previewTitle()}
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, p: 2, position: 'relative' }}>
        {previewHtml ? (
          <iframe
            srcDoc={previewHtml}
            style={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              height: '100%',
              width: '100%',
            }}
            title="Email Theme Preview"
          />
        ) : (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
          >
            <CircularProgress size={32} />
          </Stack>
        )}
      </Box>
    </Stack>
  );
};

export default ThemePreview;
