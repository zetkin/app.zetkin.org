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
    { kind: InlineNodeKind.LINE_BREAK },
    { kind: InlineNodeKind.STRING, value: signature.email },
  ];

  if (signature.phone) {
    content.push(
      { kind: InlineNodeKind.LINE_BREAK },
      { kind: InlineNodeKind.STRING, value: signature.phone }
    );
  }

  return {
    data: { content, signature },
    kind: BlockKind.PARAGRAPH,
  };
}
