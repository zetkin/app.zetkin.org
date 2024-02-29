import { OutputBlockData } from '@editorjs/editorjs';

import htmlToInlineNodes from './htmlToInlineNodes';
import { BLOCK_TYPES, BlockKind, EmailContentBlock } from '../types';

export default function editorjsBlocksToZetkinBlocks(
  editorjsBlocks: OutputBlockData[]
) {
  const zetkinBlocks: EmailContentBlock[] = [];

  editorjsBlocks.forEach((editorjsBlock) => {
    if (editorjsBlock.type === BLOCK_TYPES.BUTTON) {
      zetkinBlocks.push({
        data: {
          href: editorjsBlock.data.url,
          tag: editorjsBlock.data.tag,
          text: editorjsBlock.data.buttonText,
        },
        kind: BlockKind.BUTTON,
      });
    } else if (editorjsBlock.type === BLOCK_TYPES.HEADER) {
      zetkinBlocks.push({
        data: {
          content: htmlToInlineNodes(editorjsBlock.data.text),
          level: editorjsBlock.data.level,
        },
        kind: BlockKind.HEADER,
      });
    } else if (editorjsBlock.type === BLOCK_TYPES.LIBRARY_IMAGE) {
      zetkinBlocks.push({
        data: {
          alt: editorjsBlock.data.fileName,
          src: editorjsBlock.data.url,
        },
        kind: BlockKind.IMAGE,
      });
    } else if (editorjsBlock.type === BLOCK_TYPES.PARAGRAPH) {
      zetkinBlocks.push({
        data: {
          content: htmlToInlineNodes(editorjsBlock.data.text),
        },
        kind: BlockKind.PARAGRAPH,
      });
    }
  });

  return zetkinBlocks;
}
