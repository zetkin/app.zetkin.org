import crypto from 'crypto';
import { RemirrorJSON } from 'remirror';

import { BlockKind, EmailContentBlock } from 'features/emails/types';
import remirrorToInlineNodes from './remirrorToInlineNodes';
import { RemirrorBlockType } from '../types';

export default function remirrorToZetkin(
  remirrorBlocks: RemirrorJSON[]
): EmailContentBlock[] {
  const zetkinBlocks: EmailContentBlock[] = [];

  remirrorBlocks.forEach((remirrorBlock) => {
    if (remirrorBlock.type == RemirrorBlockType.IMAGE) {
      const attributes = remirrorBlock.attrs;

      if (attributes) {
        zetkinBlocks.push({
          data: {
            alt: attributes.alt as string,
            fileId: attributes.fileId as number,
            src: attributes.src as string,
          },
          kind: BlockKind.IMAGE,
        });
      }
    } else if (remirrorBlock.type == RemirrorBlockType.BUTTON) {
      const blockContent = remirrorBlock.content;
      const attributes = remirrorBlock.attrs;

      const hasData =
        blockContent &&
        blockContent.length > 0 &&
        !!blockContent[0] &&
        !!attributes;

      if (hasData) {
        const textContent = blockContent[0];
        const buttonText = textContent.text;
        const href = attributes.href;

        if (!!buttonText && !!href) {
          zetkinBlocks.push({
            data: {
              href: href as string,
              tag: crypto.randomUUID().slice(0, 8),
              text: buttonText,
            },
            kind: BlockKind.BUTTON,
          });
        }
      }
    } else if (remirrorBlock.type == RemirrorBlockType.HEADING) {
      const blockContent = remirrorBlock.content;
      const attributes = remirrorBlock.attrs;

      const hasData = blockContent && blockContent.length > 0 && !!attributes;

      if (hasData) {
        const inlineNodes = remirrorToInlineNodes(blockContent);
        zetkinBlocks.push({
          data: {
            content: inlineNodes,
            level: attributes.level as 1 | 2 | 3 | 4,
          },
          kind: BlockKind.HEADER,
        });
      }
    } else if (remirrorBlock.type == RemirrorBlockType.PARAGRAPH) {
      const blockContent = remirrorBlock.content;

      if (blockContent && blockContent.length > 0) {
        const inlineNodes = remirrorToInlineNodes(blockContent);
        zetkinBlocks.push({
          data: {
            content: inlineNodes,
          },
          kind: BlockKind.PARAGRAPH,
        });
      }
    }
  });

  return zetkinBlocks;
}
