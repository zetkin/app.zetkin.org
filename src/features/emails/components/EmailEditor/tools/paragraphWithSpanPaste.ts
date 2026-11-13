/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-ignore
import Paragraph from '@editorjs/paragraph';
import { BlockTool, HTMLPasteEvent } from '@editorjs/editorjs';

export default class ParagraphWithSpanPaste
  extends Paragraph
  implements BlockTool
{
  onPaste(event: HTMLPasteEvent) {
    const text = event.detail.data.textContent;
    event.detail.data = document.createElement('div');
    event.detail.data.textContent = text;
    return super.onPaste(event);
  }

  static get pasteConfig() {
    return {
      tags: ['P', 'SPAN'],
    };
  }

  declare render: BlockTool['render'];
  declare save: (block: HTMLElement) => { text: string };
}
