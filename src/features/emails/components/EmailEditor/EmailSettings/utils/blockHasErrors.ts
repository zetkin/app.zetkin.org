import isURL from 'validator/lib/isURL';
import { OutputBlockData } from '@editorjs/editorjs';

import { BLOCK_TYPES } from 'features/emails/types';

export default function blockHasErrors(block: OutputBlockData) {
  if (block.type === BLOCK_TYPES.BUTTON) {
    if (!block.data.url || !block.data.buttonText) {
      return true;
    }

    return !isURL(block.data.url, { require_protocol: true });
  }

  if (block.type === BLOCK_TYPES.PARAGRAPH) {
    const container = document.createElement('div');
    container.innerHTML = block.data.text;
    const anchors = [...container.querySelectorAll('a')];

    return anchors.some((anchor) => anchor.classList.contains('hasInvalidUrl'));
  }

  return false;
}
