import getAnchorTag from './utils/getAnchorTag';
import { API, InlineToolConstructorOptions } from '@editorjs/editorjs';

export default class LinkTool {
  private _api: API;
  private _button: HTMLButtonElement | null;
  private _input: HTMLInputElement | null;
  private _isLink: boolean;

  addLink(range: Range) {
    const selectedText = range.extractContents();
    const anchor = document.createElement('a');
    anchor.classList.add('inlineLink');

    anchor.appendChild(selectedText);
    range.insertNode(anchor);

    this._api.selection.expandToTag(anchor);
  }

  checkState() {
    const anchor = getAnchorTag(
      window.getSelection(),
      this._api.selection.findParentTag
    );

    this._isLink = !!anchor;

    if (this._isLink) {
      this.showInput();
    } else {
      this.hideInput();
    }
  }

  constructor({ api }: InlineToolConstructorOptions) {
    this._api = api;
    this._button = null;
    this._input = null;
    this._isLink = false;
  }

  hideInput() {
    if (this._input) {
      this._input.hidden = true;
    }
  }

  static get isInline() {
    return true;
  }

  removeLink() {
    const anchor = getAnchorTag(
      window.getSelection(),
      this._api.selection.findParentTag
    );

    anchor?.replaceWith(...Array.from(anchor.childNodes));
  }

  render() {
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.textContent = 'Link';
    this._button.classList.add(this._api.styles.inlineToolButton);

    return this._button;
  }

  renderActions() {
    this._input = document.createElement('input');
    this._input.style.margin = '10px';
    this._input.hidden = true;

    return this._input;
  }

  static get sanitize() {
    return {
      a: {
        class: 'inlineLink',
      },
    };
  }

  showInput() {
    if (this._input) {
      this._input.hidden = false;
    }
  }

  get state() {
    return this._isLink;
  }

  set state(isLink: boolean) {
    this._isLink = isLink;

    this._button?.classList.toggle(
      this._api.styles.inlineToolButtonActive,
      isLink
    );
  }

  surround(range: Range) {
    if (this._isLink) {
      this.removeLink();
    } else {
      this.addLink(range);
    }
  }

  static toolbox() {
    return {
      title: 'Link',
    };
  }
}
