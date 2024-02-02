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
  private _focused: boolean;
  private _input: HTMLInputElement | null;
  private _selectedAnchor: HTMLAnchorElement | null;

  constructor({ api }: InlineToolConstructorOptions) {
    super();
    this._api = api;
    this._button = null;
    this._input = null;
    this._selectedAnchor = null;
    this._focused = false;
  }

  renderActions() {
    this._input = document.createElement('input');
    this._input.style.margin = '10px';
    this._input.oninput = () => {
      if (this._selectedAnchor && this._input) {
        this._selectedAnchor.href = this._input.value;
      }
    };
    this._input.onfocus = () => {
      this._focused = true;
    };
    this._input.onblur = () => {
      this._focused = false;
      this.clear();
    };
    this._input.onkeyup = (ev) => {
      if (ev.code == 'Enter' || ev.code == 'NumpadEnter') {
        this._focused = false;
        this._api.inlineToolbar.close();
        this.clear();
      }
    };

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
        anchor.replaceWith(...Array.from(anchor.childNodes));
      });
    } else {
      const anchor = document.createElement('a');
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

      if (anchors.length == 1) {
        this._selectedAnchor = anchors[0];
        this._input.style.display = 'block';
        this._input.value = this._selectedAnchor.href;
      } else if (!this._focused) {
        this._input.style.display = 'none';
        this._selectedAnchor = null;
      }
      this._button.textContent =
        !this._selectedAnchor && anchors.length == 0 ? 'Link' : 'Unlink';
    }
  }
}
