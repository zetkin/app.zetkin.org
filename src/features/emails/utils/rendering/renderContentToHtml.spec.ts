import renderContentToHtml from './renderContentToHtml';
import { BlockKind, InlineNodeKind } from 'features/emails/types';

describe('renderContentToHtml()', () => {
  const content = {
    blocks: [
      {
        data: {
          content: [
            { kind: InlineNodeKind.STRING as const, value: 'a <b>' },
            {
              content: [{ kind: InlineNodeKind.STRING as const, value: 'x' }],
              href: 'javascript:alert(1)',
              kind: InlineNodeKind.LINK as const,
              tag: 't',
            },
          ],
        },
        kind: BlockKind.PARAGRAPH as const,
      },
    ],
  };

  it('renders an escaped fragment', () => {
    expect(renderContentToHtml(content)).toBe(
      '<p>a &lt;b&gt;<a class="email-link-t" href="">x</a></p>'
    );
  });

  it('renders a full document', () => {
    const html = renderContentToHtml(content, { document: true });
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('<body>');
  });
});
