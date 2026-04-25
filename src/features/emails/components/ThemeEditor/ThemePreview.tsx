import React, { useEffect, useState } from 'react';
import { CircularProgress, Stack, Typography } from '@mui/material';

import { EmailTheme } from 'features/emails/types';
import previewEmailThemeHtml from 'features/emails/utils/rendering/previewEmailThemeHtml';
import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

interface ThemePreviewProps {
  theme: EmailTheme | null;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const messages = useMessages(messageIds);
  const content =
    `
{
  "blocks": [
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "` +
    messages.themes.themePreview.heading.paragraphPart1() +
    `" }
        ],
        "level": 1
      }
    },
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "` +
    messages.themes.themePreview.heading.paragraphPart2() +
    `" }
        ],
        "level": 2
      }
    },
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "` +
    messages.themes.themePreview.heading.paragraphPart1() +
    `" }
        ],
        "level": 3
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          { "kind": "string", "value": "` +
    messages.themes.themePreview.paragraph.paragraphPart1() +
    `" },
          {
            "kind": "bold",
            "content": [
              { "kind": "string", "value": "` +
    messages.themes.themePreview.paragraph.bold() +
    `" }
            ]
          },
          { "kind": "string", "value": "` +
    messages.themes.themePreview.paragraph.paragraphPart2() +
    `" },
          {
            "kind": "italic",
            "content": [
              { "kind": "string", "value": "` +
    messages.themes.themePreview.paragraph.italic() +
    `" }
            ]
          },
          { "kind": "string", "value": "` +
    messages.themes.themePreview.paragraph.paragraphPart3() +
    `" },
          {
            "kind": "link",
            "content": [
              { "kind": "string", "value": "` +
    messages.themes.themePreview.paragraph.link() +
    `" }
            ],
            "href": "https://zetkin.org/",
            "tag": "sjf8dtwj"
          },
          { "kind": "string", "value": "." }
        ]
      }
    },
    {
      "kind": "image",
      "data": {
        "alt": "logo-zetkin.png",
        "fileId": 2,
        "src": "http://files.dev.zetkin.org/1/61a0fe34-247c-4c8c-9514-6bf7f9e3d578.png"
      }
    },
    {
      "kind": "button",
      "data": {
        "href": "https://zetkin.org",
        "tag": "tja96d3p",
        "text": "` +
    messages.themes.themePreview.button() +
    `"
      }
    }
  ]
}
`;
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
