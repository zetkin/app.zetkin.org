import React, { useEffect, useState } from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

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
    <Stack gap={2} sx={{ flex: 1, minWidth: '0' }}>
      <Typography variant="h5">
        {messages.themes.themeEditor.previewTitle()}
      </Typography>
      {previewHtml ? (
        <iframe
          srcDoc={previewHtml}
          style={{
            background: 'white',
            border: 'none',
            height: 'calc(100% - 32px)',
            width: '100%',
          }}
          title="Email Theme Preview"
        />
      ) : (
        <CircularProgress size={24} />
      )}
    </Stack>
  );
};

export default ThemePreview;
