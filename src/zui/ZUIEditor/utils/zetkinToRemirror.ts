import { RemirrorJSON } from 'remirror';

import { BlockKind, EmailContentBlock } from 'features/emails/types';
import { RemirrorBlockType, TextBlockContentType } from '../types';
import inlineNodesToRemirror from './inlineNodesToRemirror';

export default function zetkinToRemirror(zetkinBlocks: EmailContentBlock[]) {
  const remirrorBlocks: RemirrorJSON[] = [];

  zetkinBlocks.forEach((block) => {
    if (block.kind == BlockKind.BUTTON) {
      remirrorBlocks.push({
        attrs: {
          href: block.data.href,
        },
        content: [
          {
            text: block.data.text,
            type: TextBlockContentType.TEXT,
          },
        ],
        type: RemirrorBlockType.BUTTON,
      });
    } else if (block.kind == BlockKind.HEADER) {
      const remirrorBlockContent = inlineNodesToRemirror(block.data.content);

      remirrorBlocks.push({
        attrs: {
          level: block.data.level,
        },
        content: remirrorBlockContent,
        type: RemirrorBlockType.HEADING,
      });
    } else if (block.kind == BlockKind.IMAGE) {
      remirrorBlocks.push({
        attrs: {
          alt: block.data.alt,
          fileId: block.data.fileId,
          src: block.data.src,
        },
        type: RemirrorBlockType.IMAGE,
      });
    } else if (block.kind == BlockKind.PARAGRAPH) {
      const remirrorBlockContent = inlineNodesToRemirror(block.data.content);
      remirrorBlocks.push({
        content: remirrorBlockContent,
        type: RemirrorBlockType.PARAGRAPH,
      });
    }
  });
  return remirrorBlocks;
}
