import { OutputBlockData } from '@editorjs/editorjs';

import inlineNodesToHtml from './inlineNodesToHtml';
import { BLOCK_TYPES, BlockKind, EmailContentBlock } from '../types';

export default function zetkinBlocksToEditorjsBlocks(
  zetkinBlocks: EmailContentBlock[]
) {
  const editorjsBlocks: OutputBlockData[] = [];

  const buttonTagIds: string[] = [];

  zetkinBlocks.forEach((block) => {
    if (block.kind === BlockKind.BUTTON) {
      const tag = buttonTagIds.includes(block.data.tag)
        ? Math.random().toString(36).substring(2, 10)
        : block.data.tag;
      buttonTagIds.push(tag);
      editorjsBlocks.push({
        data: {
          buttonText: block.data.text,
          tag,
          url: block.data.href,
        },
        id: Math.random().toString(36).substring(2, 10),
        type: BLOCK_TYPES.BUTTON,
      });
    } else if (block.kind === BlockKind.HEADER) {
      editorjsBlocks.push({
        data: {
          level: block.data.level,
          text: inlineNodesToHtml(block.data.content),
        },
        id: Math.random().toString(36).substring(2, 10),
        type: BLOCK_TYPES.HEADER,
      });
    } else if (block.kind === BlockKind.IMAGE) {
      editorjsBlocks.push({
        data: {
          fileId: block.data.fileId,
          fileName: block.data.alt,
          url: block.data.src,
        },
        id: Math.random().toString(36).substring(2, 10),
        type: BLOCK_TYPES.LIBRARY_IMAGE,
      });
    } else if (block.kind === BlockKind.PARAGRAPH) {
      editorjsBlocks.push({
        data: {
          text: inlineNodesToHtml(block.data.content),
        },
        id: Math.random().toString(36).substring(2, 10),
        type: BLOCK_TYPES.PARAGRAPH,
      });
    }
  });

  return editorjsBlocks;
}
