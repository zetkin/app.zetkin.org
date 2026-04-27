import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';

export default function usePreviewEmailTheme(): string {
  const messages = useMessages(messageIds);

  return (
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
`
  );
}
