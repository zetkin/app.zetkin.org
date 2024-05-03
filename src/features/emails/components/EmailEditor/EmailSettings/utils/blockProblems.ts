import isURL from 'validator/lib/isURL';
import { OutputBlockData } from '@editorjs/editorjs';

import { BLOCK_TYPES, BlockProblem } from 'features/emails/types';

export default function blockProblems(block: OutputBlockData): BlockProblem[] {
  const blockProblems: BlockProblem[] = [];

  if (block.type === BLOCK_TYPES.BUTTON) {
    if (!block.data.url || !isURL(block.data.url, { require_protocol: true })) {
      blockProblems.push(BlockProblem.INVALID_BUTTON_URL);
    }

    if (!block.data.buttonText) {
      blockProblems.push(BlockProblem.DEFAULT_BUTTON_TEXT);
    }
  } else if (block.type === BLOCK_TYPES.PARAGRAPH) {
    const container = document.createElement('div');
    container.innerHTML = block.data.text;
    const anchors = [...container.querySelectorAll('a')];

    if (
      anchors.some((anchor) => !isURL(anchor.href, { require_protocol: true }))
    ) {
      blockProblems.push(BlockProblem.INVALID_LINK_URL);
    }
  }

  return blockProblems;
}
