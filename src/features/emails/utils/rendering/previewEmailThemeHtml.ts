import { EmailContent, EmailTheme } from 'features/emails/types';
import EmailMJMLConverter from 'features/emails/utils/rendering/EmailMJMLConverter';

export default async function previewEmailThemeHtml(
  theme: EmailTheme
): Promise<string> {
  const content = `
{
  "blocks": [
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "I am a heading 1" }
        ],
        "level": 1
      }
    },
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "I am a heading 2" }
        ],
        "level": 2
      }
    },
    {
      "kind": "header",
      "data": {
        "content": [
          { "kind": "string", "value": "I am a heading 3" }
        ],
        "level": 3
      }
    },
    {
      "kind": "paragraph",
      "data": {
        "content": [
          { "kind": "string", "value": "I am a paragraph with " },
          {
            "kind": "bold",
            "content": [
              { "kind": "string", "value": "bold" }
            ]
          },
          { "kind": "string", "value": ", " },
          {
            "kind": "italic",
            "content": [
              { "kind": "string", "value": "italic" }
            ]
          },
          { "kind": "string", "value": " text and an " },
          {
            "kind": "link",
            "content": [
              { "kind": "string", "value": "external link" }
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
        "text": "I am a button"
      }
    }
  ]
}
`;
  const contentObj = JSON.parse(content) as EmailContent;
  const { default: mjml2html } = await import('mjml-browser');
  const converter = new EmailMJMLConverter();
  const mjml = converter.convertContentToMjml(contentObj, theme);

  if (!mjml) {
    return '';
  }

  const output = mjml2html(mjml);

  return output.html;
}
