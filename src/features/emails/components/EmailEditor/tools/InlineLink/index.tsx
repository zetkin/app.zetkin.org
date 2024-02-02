import getAnchorTags from './utils/getAnchorTags';
import InlineToolBase from '../../utils/InlineToolBase';
import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

export default class LinkTool extends InlineToolBase implements InlineTool {
  private _api: API;
  private _button: HTMLButtonElement | null;
  private _input: HTMLInputElement | null;

  constructor({ api }: InlineToolConstructorOptions) {
    super();
    this._api = api;
    this._button = null;
    this._input = null;
  }

  renderActions() {
    this._input = document.createElement('input');
    this._input.style.margin = '10px';

    return this._input;
  }

  renderButton() {
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.textContent = 'Link';
    this._button.classList.add(this._api.styles.inlineToolButton);
    return this._button;
  }

  static get sanitize() {
    return {
      a: {
        class: 'inlineLink',
      },
    };
  }

  surround(range: Range) {
    const anchors = getAnchorTags(range);
    if (anchors.length) {
      anchors.forEach((anchor) => {
        anchor.childNodes.forEach((child) => {
          anchor.parentNode?.appendChild(child);
          anchor.parentNode?.insertBefore(child, anchor);
        });
        anchor.parentNode?.removeChild(anchor);
      });
    } else {
      const anchor = document.createElement('A');
      anchor.classList.add('inlineLink');

      const content = range.extractContents();
      anchor.append(content);

      range.insertNode(anchor);
      this._api.selection.expandToTag(anchor);
    }

    const newRange =
      window.getSelection()?.getRangeAt(0) || document.createRange();
    this.update(newRange);
  }

  update(range: Range) {
    if (this._input && this._button) {
      const anchors = getAnchorTags(range);

      this._input.style.display = anchors.length == 1 ? 'block' : 'none';

      this._button.textContent = anchors.length == 0 ? 'Link' : 'Unlink';
    }
  }
}
