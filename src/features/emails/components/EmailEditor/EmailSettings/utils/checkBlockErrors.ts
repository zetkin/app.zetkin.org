import isURL from 'validator/lib/isURL';
import { OutputBlockData } from '@editorjs/editorjs';

import { BLOCK_TYPES } from 'features/emails/types';

export default function checkBlockErrors(block: OutputBlockData) {
  if (block.type === BLOCK_TYPES.BUTTON) {
    if (!block.data.url || !block.data.buttonText) {
      return true;
    }

    return !isURL(block.data.url, { require_protocol: true });
  }
  return false;
}
