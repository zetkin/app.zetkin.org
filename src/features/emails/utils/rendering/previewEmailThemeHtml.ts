import { EmailContent, EmailTheme } from 'features/emails/types';
import EmailMJMLConverter from 'features/emails/utils/rendering/EmailMJMLConverter';

export default async function previewEmailThemeHtml(
  content: string,
  theme: EmailTheme
): Promise<string> {
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
