import { OutputBlockData } from '@editorjs/editorjs';

import inlineNodesToHtml from './inlineNodesToHtml';
import { BLOCK_TYPES, BlockKind, EmailContentBlock } from '../types';

export default function zetkinBlocksToEditorjsBlocks(
  zetkinBlocks: EmailContentBlock[]
) {
  const editorjsBlocks: OutputBlockData[] = [];

  zetkinBlocks.forEach((block) => {
    if (block.kind === BlockKind.BUTTON) {
      editorjsBlocks.push({
        data: {
          buttonText: block.data.text,
          tag: block.data.tag,
          url: block.data.href,
        },
        type: BLOCK_TYPES.BUTTON,
      });
    } else if (block.kind === BlockKind.HEADER) {
      editorjsBlocks.push({
        data: {
          level: block.data.level,
          text: inlineNodesToHtml(block.data.content),
        },
        type: BLOCK_TYPES.HEADER,
      });
    } else if (block.kind === BlockKind.IMAGE) {
      editorjsBlocks.push({
        data: {
          fileName: block.data.alt,
          url: block.data.src,
        },
        type: BLOCK_TYPES.LIBRARY_IMAGE,
      });
    } else if (block.kind === BlockKind.PARAGRAPH) {
      editorjsBlocks.push({
        data: {
          text: inlineNodesToHtml(block.data.content),
        },
        type: BLOCK_TYPES.PARAGRAPH,
      });
    }
  });

  return editorjsBlocks;
}
