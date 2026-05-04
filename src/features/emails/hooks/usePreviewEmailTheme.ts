import messageIds from 'features/emails/l10n/messageIds';
import { useMessages } from 'core/i18n';
import useUser from 'core/hooks/useUser';

export default function usePreviewEmailTheme(): string {
  const messages = useMessages(messageIds);
  const user = useUser();
  const userName = user?.first_name ? ' ' + user?.first_name : '';

  return (
    `
{
  "blocks": [
    {
      "kind": "header",
      "data": {
        "content": [
          { 
            "kind": "string",
            "value": "` +
    messages.themes.themePreview.heading.paragraphPart1() +
    userName +
    `"
          },
          {
            "kind": "string",
            "value": ", "
          }
        ],
        "level": 1
      }
    },
    {
      "kind": "header",
      "data": {
        "content": [
          {
            "kind": "string",
            "value": "` +
    messages.themes.themePreview.heading.paragraphPart2() +
    `"
          }
        ],
        "level": 2
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
    },
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "` +
    messages.themes.themePreview.heading.paragraphPart3() +
    `" }
        ],
        "level": 3
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          {
            "kind": "string",
            "value": "` +
    messages.themes.themePreview.paragraph.paragraph1() +
    `"
          }
        ]
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          {
            "kind": "string",
            "value": "` +
    messages.themes.themePreview.paragraph.paragraph2() +
    `"
          }
        ]
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          {
            "kind": "bold",
            "content": [
              {
                "kind": "string",
                "value": "` +
    messages.themes.themePreview.paragraph.paragraph3() +
    `"
              }
            ]
          }
        ]
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          {
            "kind": "bold",
            "content": [
              {
                "kind": "string",
                "value": "I. "
              }
            ]
          },
          {
            "kind": "italic",
            "content": [
              {
                "kind": "string",
                "value": "` +
    messages.themes.themePreview.paragraph.paragraph4() +
    `"
              }
            ]
          }
        ]
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          {
            "kind": "bold",
            "content": [
              {
                "kind": "string",
                "value": "II. "
              }
            ]
          },
          {
            "kind": "italic",
            "content": [
              {
                "kind": "string",
                "value": "` +
    messages.themes.themePreview.paragraph.paragraph5() +
    `"
              }
            ]
          }
        ]
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          {
            "kind": "string",
            "value": "` +
    messages.themes.themePreview.paragraph.paragraph6() +
    `"
          },
          {
            "kind": "link",
            "content": [
              {
                "kind": "string",
                "value": "` +
    messages.themes.themePreview.paragraph.paragraph7() +
    `"
              }
            ],
            "href": "https://www.gutenberg.org/files/31193/31193-h/31193-h.htm",
            "tag": "communistManifesto"
          },
          {
            "kind": "string",
            "value": "."
          }
        ]
      }
    },
    {
      "kind": "image",
      "data": {
        "alt": "cover.jpg",
        "fileId": 3,
        "src": "http://files.dev.zetkin.org/1/d4f3ffbf-3757-4873-841c-6615e2b85768.jpg"
      }
    }
  ]
}
`
  );
}
