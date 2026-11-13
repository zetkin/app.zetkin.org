import {
  BlockKind,
  EmailContentInlineNode,
  InlineNodeKind,
  ParagraphBlock,
  SignatureData,
} from '../types';

export default function signatureToParagraph(
  signature: SignatureData
): ParagraphBlock {
  const content: EmailContentInlineNode[] = [
    {
      content: [{ kind: InlineNodeKind.STRING, value: signature.name }],
      kind: InlineNodeKind.BOLD,
    },
  ];

  for (const value of [
    signature.title,
    signature.organization,
    signature.email,
    signature.phone,
  ]) {
    if (value) {
      content.push(
        { kind: InlineNodeKind.LINE_BREAK },
        { kind: InlineNodeKind.STRING, value }
      );
    }
  }

  return {
    data: { content, signature },
    kind: BlockKind.PARAGRAPH,
  };
}
