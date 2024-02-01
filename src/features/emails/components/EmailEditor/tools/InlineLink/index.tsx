import getAnchorTags from './utils/getAnchorTags';
import {
  API,
  InlineTool,
  InlineToolConstructorOptions,
} from '@editorjs/editorjs';

let nextId = 1;

export default class LinkTool implements InlineTool {
  private _api: API;
  private _button: HTMLButtonElement | null;
  private _id: number;
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
    const range = window.getSelection()?.getRangeAt(0);

    const anchors = range
      ? getAnchorTags(range, this._api.selection.findParentTag)
      : [];

    this._isLink = anchors.length > 0;

    if (this._isLink) {
      this.showInput();
      return true;
    } else {
      this.hideInput();
      return false;
    }
  }

  clear() {
    this.destroy();
  }

  constructor({ api }: InlineToolConstructorOptions) {
    this._api = api;
    this._button = null;
    this._input = null;
    this._isLink = false;
    this._id = nextId++;
    this.handleSelectionChangeBound = () => undefined;
  }

  destroy() {
    document.removeEventListener(
      'selectionchange',
      this.handleSelectionChangeBound
    );
  }

  private handleSelectionChangeBound: () => void | undefined;

  hideInput() {
    if (this._input) {
      this._input.hidden = true;
    }
  }

  static get isInline() {
    return true;
  }

  removeLink(range: Range) {
    const anchors = getAnchorTags(range, this._api.selection.findParentTag);

    anchors.forEach((anchor) => {
      anchor.childNodes.forEach((child) =>
        anchor.parentNode?.appendChild(child)
      );
      anchor.parentNode?.removeChild(anchor);
    });
  }

  render() {
    this._button = document.createElement('button');
    this._button.type = 'button';
    this._button.textContent = 'Link';
    this._button.classList.add(this._api.styles.inlineToolButton);

    const handleSelectionChange = () => {
      this.checkState();

      if (this._input) {
        this._input.hidden = !this._isLink;
      }
    };
    this.handleSelectionChangeBound = handleSelectionChange.bind(this);
    document.addEventListener(
      'selectionchange',
      this.handleSelectionChangeBound
    );

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
      this.removeLink(range);
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
