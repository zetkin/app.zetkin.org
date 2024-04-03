import mjml2html from 'mjml';

import EmailContentTraverser from './EmailContentTraverser';
import EmailMJMLConverter from './EmailMJMLConverter';
import { ZetkinEmail } from 'utils/types/zetkin';
import { EmailContent, InlineNodeKind } from 'features/emails/types';

export default function renderEmailHtml(
  email: ZetkinEmail,
  variableValues: Record<string, string>
): string {
  const { frame, content } = email;

  if (!content) {
    return '';
  }

  const contentObj = JSON.parse(content) as EmailContent;

  const traverser = new EmailContentTraverser(contentObj);
  const expanded = traverser.traverse({
    handleInline(node) {
      if (node.kind == InlineNodeKind.VARIABLE) {
        return {
          kind: InlineNodeKind.STRING,
          value: variableValues[node.name] || '',
        };
      } else {
        return node;
      }
    },
  });

  const converter = new EmailMJMLConverter();
  const mjml = converter.convertContentToMjml(expanded, frame);

  if (!mjml) {
    return '';
  }

  const output = mjml2html(mjml);

  return output.html;
}
