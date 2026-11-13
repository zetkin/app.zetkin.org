import { describe, expect, it } from '@jest/globals';

import blockProblems from '../components/EmailEditor/EmailSettings/utils/blockProblems';
import editorjsBlocksToZetkinBlocks from './editorjsBlocksToZetkinBlocks';
import renderEmailHtml from './rendering/renderEmailHtml';
import EmailContentTraverser from './rendering/EmailContentTraverser';
import signatureToParagraph from './signatureToParagraph';
import { ZetkinEmail } from 'utils/types/zetkin';
import zetkinBlocksToEditorjsBlocks from './zetkinBlocksToEditorjsBlocks';
import { BLOCK_TYPES, BlockKind, BlockProblem, SignatureData } from '../types';

const signature: SignatureData = {
  email: 'alex@example.org',
  name: 'Alex Organizer',
  phone: '+49 123 456789',
};

const signatureWithTitleAndOrganization: SignatureData = {
  ...signature,
  organization: 'Example Organization',
  title: 'Organizer',
};

describe('signature blocks', () => {
  it('preserves signature metadata when traversing email content', () => {
    const content = { blocks: [signatureToParagraph(signature)] };
    expect(new EmailContentTraverser(content).traverse({})).toEqual(content);
  });

  it('keeps readable paragraph content if metadata is removed', () => {
    const paragraph = signatureToParagraph(signature);
    delete paragraph.data.signature;
    const reopened = zetkinBlocksToEditorjsBlocks([paragraph]);
    expect(reopened[0].type).toEqual(BLOCK_TYPES.PARAGRAPH);
    expect(reopened[0].data.text).toEqual(
      '<b>Alex Organizer</b><br>alex@example.org<br>+49 123 456789'
    );
    const html = renderEmailHtml(
      {
        content: JSON.stringify({ blocks: [paragraph] }),
        theme: null,
      } as ZetkinEmail,
      {}
    );
    expect(html).toContain(
      '<p><b>Alex Organizer</b><br>alex@example.org<br>+49 123 456789</p>'
    );
  });

  it.each([
    signature,
    { ...signature, phone: undefined },
    signatureWithTitleAndOrganization,
  ])('preserves contact details when saving and reopening', (data) => {
    const savedBlocks = editorjsBlocksToZetkinBlocks([
      { data, type: BLOCK_TYPES.SIGNATURE },
    ]);
    expect(savedBlocks).toEqual([
      {
        data: { content: expect.any(Array), signature: data },
        kind: BlockKind.PARAGRAPH,
      },
    ]);
    expect(
      zetkinBlocksToEditorjsBlocks(JSON.parse(JSON.stringify(savedBlocks)))
    ).toEqual([{ data, id: expect.any(String), type: BLOCK_TYPES.SIGNATURE }]);
  });

  it('renders the title and organization after the name', () => {
    const paragraph = signatureToParagraph(signatureWithTitleAndOrganization);
    delete paragraph.data.signature;
    expect(zetkinBlocksToEditorjsBlocks([paragraph])[0].data.text).toEqual(
      '<b>Alex Organizer</b><br>Organizer<br>Example Organization<br>alex@example.org<br>+49 123 456789'
    );
    const html = renderEmailHtml(
      {
        content: JSON.stringify({
          blocks: [signatureToParagraph(signatureWithTitleAndOrganization)],
        }),
        theme: null,
      } as ZetkinEmail,
      {}
    );
    expect(html).toContain(
      '<b>Alex Organizer</b><br>Organizer<br>Example Organization<br>alex@example.org'
    );
  });

  it('requires a name and valid email but allows an omitted phone', () => {
    expect(
      blockProblems({
        data: { ...signature, phone: undefined },
        type: BLOCK_TYPES.SIGNATURE,
      })
    ).toEqual([]);
    expect(
      blockProblems({
        data: { email: 'invalid', name: ' ' },
        type: BLOCK_TYPES.SIGNATURE,
      })
    ).toEqual([
      BlockProblem.SIGNATURE_NAME_MISSING,
      BlockProblem.INVALID_SIGNATURE_EMAIL,
    ]);
  });

  it.each([signature, { ...signature, phone: undefined }])(
    'includes a compact signature in rendered email HTML',
    (data) => {
      const html = renderEmailHtml(
        {
          content: JSON.stringify({
            blocks: [signatureToParagraph(data)],
          }),
          theme: null,
        } as ZetkinEmail,
        {}
      );
      expect(html).toContain('<b>Alex Organizer</b><br>alex@example.org');
      expect(html).toContain('font-size:12px');
      expect(html).toContain('line-height:16px');
      if (data.phone) {
        expect(html).toContain('<br>+49 123 456789');
      } else {
        expect(html).not.toContain('undefined');
        expect(html).not.toContain('alex@example.org<br>');
      }
    }
  );

  it('escapes HTML in every contact field', () => {
    const html = renderEmailHtml(
      {
        content: JSON.stringify({
          blocks: [
            signatureToParagraph({
              email: '<img src=x onerror=alert(1)>',
              name: '<script>alert(1)</script>',
              organization: '<i>Organization</i>',
              phone: '<b>123</b>',
              title: '<b>Organizer</b>',
            }),
          ],
        }),
        theme: null,
      } as ZetkinEmail,
      {}
    );
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;img');
    expect(html).toContain('&lt;b&gt;123&lt;/b&gt;');
    expect(html).toContain('&lt;i&gt;Organization&lt;/i&gt;');
    expect(html).toContain('&lt;b&gt;Organizer&lt;/b&gt;');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
  });
});
