import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { EmailTheme } from 'features/emails/types';
import previewEmailThemeHtml from 'features/settings/utils/previewEmailThemeHtml';
import usePreviewEmailTheme from 'features/settings/hooks/usePreviewEmailTheme';

interface ThemePreviewProps {
  theme: EmailTheme | null;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const content = usePreviewEmailTheme();
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    if (!theme) {
      return;
    }

    const update = async () => {
      try {
        const html = await previewEmailThemeHtml(content, theme);
        setPreviewHtml(html);
      } catch (e) {
        // Ignore render errors while user is mid-typing
      }
    };

    update();
  }, [theme, content]);

  return (
    <Box sx={{ flex: 1, minWidth: '0' }}>
      {previewHtml ? (
        <iframe
          srcDoc={previewHtml}
          style={{
            background: 'white',
            border: 'none',
            height: '99%',
            width: '100%',
          }}
          title="Email Theme Preview"
        />
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={32} />
        </Box>
      )}
    </Box>
  );
};

export default ThemePreview;
